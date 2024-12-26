import { API_BASE_URL, API_ENDPOINT } from '@/conf'

export async function verifyRefCode(refCode: string, accessToken: string) {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT.CONTACTS}/search?criteria=referral_id:equals:${refCode}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.json()
}

export async function registerUser(userData: any, accessToken: string) {
  delete userData.refCode
  const zohoData = {
    data: [{ ...userData, Last_Name: userData.Name1 }],
  }

  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINT.CONTACTS}`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(zohoData),
  })
  return response.json()
}
