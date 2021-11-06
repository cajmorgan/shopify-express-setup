FEEL FREE TO CONTRIBUTE TO THIS PROJECT

# SHOPIFY EXPRESS SETUP
This is a boilerplate in TypeScript that you can use to set-up your new embedded Shopify app using oAuth.
Setting up your first Shopify app can be a very tedious process and that's why I created the repo, to solve this problem. 

## Shopify Create App
If you have seen the documentation for Shopify, they have built a "create app" alternativ that is similar to "create-react-app". The problem with that boilerplate is that is has very hard to customize the backend. This is because it's written with a lot of Shopify's own libraries which most of the time are completely undocumented for outsiders who wants to work with them. Because of the time I've spent learning to set up a Shopify app, I took this initiativ to actually do something about it. 

## Who is this for
At the moment, this boilerplate is a really great place to start just to get your first simple app running using TypeScript, which in my opinion should become a standard for Node backend programming. 
It's setup using this following stack:

- TypeScript /w Node
- Express
- React (/w Webpack)
- Shopify app-bridge & Polaris (for frontend)

The stack is kept simple to make customization much more easy. For the moment, the setup uses a proxy endpoint "/graphql" which you can find in server.ts. The reason for this is because CORS when making requests from the frontend. There is probably a more elegant way to solve that but this works good for now. Only downside to this is that your server will have to proxy all the front-end requests as well. 
One question you might have is about Shopify app-bridge. That's a library from Shopify which makes it possible for your app to be embedded inside a customers store, there are also a lot more stuff you can do with it, but for this I think it's sufficient. 

## Setup
First of all, create your Shopify App in the partners.shopify.com dashboard and get the API Key and Secret. Shopify requires you to host your app, so while developing, it's a great idea to use [Localtunnel](http://localtunnel.github.io/www/)

Clone this repo and start by running.
```
npm run config
```

Enter all the correct details for your Shopify app according to the CLI-program. You can change them later either by editing the config.json file or run the program again. 

**Important note regarding APP_NAME and APP_URL**
APP_NAME should be the name of the app in the URL from the store, that is the name you first entered when creating the app. This setup uses the name for redirecting the user to the correct page (your app). Also about APP_URL, every time your update this value, you need to re-run webpack (even if you set it to watch) by:

```
npm run build
```

Do not use ngrok which Shopify recommends, you will hit the limit in an extremely short of time (especially if you've ever used "create shopify app" boilerplate) I'm using localtunnel which is a free alternative and works great. The only annoying thing is that you need to update the url everytime you run a new instance of localtunnel (both in the config.json file and at the partner dashboard).

## Be Aware
This boilerplate is currently in an early stage and is not at some places using best practicing when it comes security. For example, the permanent access token frome every store is served through url params which is something Shopify probably not would recommend. The best practice here would probably be too regenerate a new access token after some time and storing it as a cookie or in another way, but for the moment this solution was most comfortable to setup. Also, Shopify didn't really give any great advice on this what I could find which is something you probably know about if you read through their documentation, some things are just not documentated at all unfortunately. 
