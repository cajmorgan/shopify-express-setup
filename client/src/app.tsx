import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { AppProvider, Heading } from '@shopify/polaris'
import translations from '@shopify/polaris/locales/en.json'

function getAccessTokens(): string[] {
  const path = window.location.href.replace(/^.+\?/i, '');
  const searchParams: URLSearchParams = new URLSearchParams(path);
  const shopName: string = searchParams.get('auth')!;
  const accessCode: string = searchParams.get('access_code')!;

  return [shopName, accessCode];
}

const accessTokens: string[] = getAccessTokens();

async function sendRequestUsingFetch(bodyStr: string) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      shop: accessTokens[0],
      access: accessTokens[1]
    },
    body: bodyStr
  })

  const parsed = await res.json()

  return parsed;
}


const App = () => {
  const [shopName, setShopName] = useState('');
  useEffect(() => {
    sendRequestUsingFetch(`
    query {
      shop {
        name
      }
    }`).then(res => setShopName(res.data.shop.name))
    
  })
  return (
   <AppProvider i18n={translations}> 
     <Heading>
       It's running! 🤩
       Fetched from store: {shopName}
     </Heading>
   </AppProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)