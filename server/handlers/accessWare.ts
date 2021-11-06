import { Request, Response, NextFunction } from "express";
import { request } from 'https';
import { shopObject } from "../../interfaces";
import { API_KEY, API_SECRET, SCOPES, APP_URL } from "../../config/config.json";
import * as utilities from './utilities'

const redirect_url = APP_URL + "/get-access";

const shops: shopObject[] = [];

function getAccess (req: any, res: any, next: NextFunction) {
  const urlPath: string = req.url.replace('/?', '');
  const searchParams = new URLSearchParams(urlPath);
  const authenticated = searchParams.get('authenticated');
  const hmacExist = searchParams.get('hmac');

  if (authenticated) {
    next();
  }

  const hmacDigest: boolean =  utilities.verifyHmacFromKey(urlPath, API_SECRET);
  const shopObj: shopObject = utilities.createShopObject(urlPath, API_KEY, SCOPES, redirect_url, "value");
  req.shopifyRedirectUrl = `https://${shopObj.shop}/admin/oauth/authorize?client_id=${shopObj.api_key}&scope=${shopObj.scopes}&redirect_uri=${shopObj.redirect_uri}&state=${shopObj.nonce}&grant_options[]=${shopObj.access_mode}`
  if(hmacDigest) {
    shops.push(shopObj);
    next();
  } else if (hmacExist) {
    next('err');
  }
}

function checkResponse (req: any, res: any, next: NextFunction) {
  const urlPath: string = req.url.replace('/get-access/?', '');
  const searchParams = new URLSearchParams(urlPath);
  const nameOfShop = searchParams.get('shop');
  const accessCode = searchParams.get('code');
  const currentShopObject: shopObject = {
    shop: '',
    api_key: '',
    scopes: '',
    redirect_uri: '',
    nonce: 0,
    access_mode: '',
    access_code: '',
  }

  let shopIndex = 0;

  
  shops.forEach((shop, index) => {
    if (shop.shop === nameOfShop) {
      Object.assign(currentShopObject, shop);
      shopIndex = index;
    }
  })

  const verification = utilities.verifyResponseWithShop(currentShopObject, searchParams, API_SECRET, urlPath);

  if(!verification) {
    shops.splice(shopIndex, 1);
    next('Something went wrong with verification');
  }

  const requestFromCall = request(`https://${currentShopObject.shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    let serverResponse = '';

    res.on('data', (chunk) => {
      serverResponse += chunk;
    })

    res.on('end', () => {
      const resObj = JSON.parse(serverResponse);
      if (resObj.scope !== currentShopObject.scopes) {
        next('Scope errors, response not the same')
      }
      currentShopObject.access_code = resObj.access_token;
      Object.assign(shops[shopIndex], currentShopObject);
      req.currentShop = currentShopObject; 
      next();
    })

  })

  requestFromCall.write(JSON.stringify({
    client_id: API_KEY,
    client_secret: API_SECRET,
    code: accessCode
  }))

  requestFromCall.end();
  
}

export {
  getAccess,
  checkResponse
}