/** A location for all interfaces, just import them! */
interface shopObject {
  shop: string | null,
  api_key: string,
  scopes: string,
  redirect_uri: string,
  nonce: number,
  access_mode: string,
  access_code: string | null
}

export {
  shopObject,
}