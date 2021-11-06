import { createHmac } from 'crypto';
import { NextFunction } from 'express';
import { shopObject } from '../../interfaces';
import { request } from 'https';

/**
 * 
 * @param urlPath The url path params f.e hmac=ae08a409b4a8fd032a5dc3466e24e34a7a7e7c3011e6723846e2cca89aa4fd9e&shop=cajs-test-store.myshopify.com&timestamp=1633690889
 * @param api_secret The secret key to your Shopify App, f.e: shpss_9c*************************
 * @returns {boolean}
 */
function verifyHmacFromKey(urlPath: string, api_secret: string): boolean {
  const searchParams = new URLSearchParams(urlPath);
  const hmac: string | null = searchParams.get('hmac');
  if(!hmac) {
    return false
  }

  searchParams.delete('hmac');
  const hashInput = searchParams.toString();
  const hash = createHmac('sha256', api_secret)
    .update(hashInput)
    .digest('hex')

  return hash === hmac 
}


/**
 * @param urlPath 
 * @param api_key 
 * @param scopes 
 * @param redirect_uri 
 * @param access_mode 
 * @returns {shopObject}
 */
function createShopObject(urlPath: string, api_key: string, scopes: string, redirect_uri: string, access_mode: string): shopObject {
  const searchParams = new URLSearchParams(urlPath);
  const shop: string | null = searchParams.get('shop');
  const nonce: number = Number(searchParams.get('timestamp'));

  const shopObj: shopObject = {
    shop,
    api_key,
    scopes,
    redirect_uri,
    nonce,
    access_mode,
    access_code: ''
  }

  return shopObj
}

/**
 * @param shopObj 
 * @param searchParams 
 * @param api_secret 
 * @param urlPath 
 * @returns {boolean}
 */ 
function verifyResponseWithShop(shopObj: shopObject, searchParams: URLSearchParams, api_secret: string, urlPath: string) {
  let verification = true;

  if(!verifyHmacFromKey(urlPath, api_secret)) {
    verification = false;
  }

  if(shopObj.shop !== searchParams.get('shop')) {
    verification = false;
  }

  return verification;
}


/**
 * @param req 
 * @param res 
 * @param next 
 * @next
 */
function processRequestsAsProxy (req: any, res: any, next: NextFunction) {
  const api_version = '2021-10'
  const shop = req.get('shop');
  const access_code = req.get('access');
  const url = `https://${shop}/admin/api/${api_version}/graphql.json`;
  if(shop === 'null' || access_code === 'null') {
    return next();
  }
 
  req.pipe(request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/graphql',
      'X-Shopify-Access-Token': access_code
    }
  }, response => {
    let body = '';
    response.on('data', chunk => {
      body += chunk;
    })

    response.on('end', () => {
      req.body = body;
      next();
    })
  }))

}


export { 
  verifyHmacFromKey,
  createShopObject,
  verifyResponseWithShop,
  processRequestsAsProxy
}

