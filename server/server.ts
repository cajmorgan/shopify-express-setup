import express, {Request, response, Response } from 'express'
import { shopObject } from '../interfaces';
import * as accessWare from './handlers'
import { APP_URL, APP_NAME } from '../config/config.json';
import { join } from 'path';
import { processRequestsAsProxy } from './handlers/utilities';
const app = express();
const port = 8080;

/* Stored temporarily - resets on restart */
const activeShops: shopObject[] = [];

app.use(express.static('client/dist'));

app.get('/get-access', accessWare.checkResponse, (req: any, res: any) => {
  if(!activeShops.find(e => e.shop === req.currentShop.shop)) {
    activeShops.push(req.currentShop);
  }
  
  res.redirect(`${APP_URL}/?authenticated=${req.currentShop.shop}&code=${req.currentShop.access_code}&`); 
})

app.get('/', accessWare.getAccess, (req: any, res: any) => {
  const urlPath: string = req.url.replace('/?', '');
  const searchParams = new URLSearchParams(urlPath);
  const authenticatedParam = searchParams.get('authenticated');
  const accessCodeParam = searchParams.get('code');
  let currentShop;
  
  for(const shop of activeShops) {
    if(shop.shop === authenticatedParam && shop.access_code === accessCodeParam) {
      currentShop = shop;
    } 
  }
  console.log(activeShops);
  if(!currentShop) {
    res.sendFile(join(__dirname, '../client/dist', 'main.html')); 
  } else {
    res.redirect(`https://${currentShop.shop}/admin/apps/${APP_NAME}/?auth=${currentShop.shop}&access_code=${currentShop.access_code}&`);    
  }
})

app.post('/graphql', processRequestsAsProxy, (req: any, res: any) => { 
  res.send(req.body);
})

/** Needs to be implemented */
app.post('/webhooks', (req: any, res: any) => {
  res.status(200);
  res.send();
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
});
