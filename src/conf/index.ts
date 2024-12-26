export const ENV = {
  VITE_API_BASE_URL: String(import.meta.env.VITE_API_BASE_URL),
  VITE_API_CLIENT_SECRET: String(import.meta.env.VITE_API_CLIENT_SECRET),
  VITE_API_CLIENT_ID: String(import.meta.env.VITE_API_CLIENT_ID),
  VITE_API_REFRESH_TOKEN: String(import.meta.env.VITE_API_REFRESH_TOKEN),
}

export const API_ENDPOINT = {
  PROPERTIES: 'crm/v2.1/Accounts',
  PROPERTIES_COUNT: 'crm/v2.1/Accounts/actions/count',
  REFRESH_TOKEN: 'oauth/v2/token',
  CONTACTS: 'crm/v2.1/Contacts',
  SEARCH: 'crm/v7/Accounts/search',
  DEAL: 'crm/v7/Deals',
}

// export const SERVER_URL = 'http://localhost:3000'
export const SERVER_URL = 'https://mybankauction-backend.vercel.app'

export const API_BASE_URL = `${SERVER_URL}/api/zoho?endpoint=`
