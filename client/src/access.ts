import { API_KEY, SCOPES, APP_URL } from "../../config/config.json";
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';

const redirect_url = APP_URL + "/get-access/";
const path = window.location.href.replace(/^.+\?/i, '');
const searchParams = new URLSearchParams(path);
const shopUrl = searchParams.get('shop');
const host = searchParams.get('host');
const auth = searchParams.get('auth');

const permissionUrl = `https://${shopUrl}/admin/oauth/authorize?client_id=${API_KEY}&scope=${SCOPES}&redirect_uri=${redirect_url}&`;

if(auth === shopUrl) {
  console.log(shopUrl, ' authenticated');
} else if (window.top == window.self) {
  window.location.assign(permissionUrl);
} else {
  const app = createApp({
    apiKey: API_KEY,
    host: host!
  });
  // window.app = app;
  Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);   
}
