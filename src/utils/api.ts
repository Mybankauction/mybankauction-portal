import { API_ENDPOINT } from '@/conf'

export async function verifyRefCode(refCode: string, accessToken: string) {
  const response = await fetch(
    `/zoho/${API_ENDPOINT.CONTACTS}/search?criteria=referral_id:equals:${refCode}`,
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
  // debugger
  console.log(zohoData)
  const response = await fetch(`/zoho/crm/v2/Contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(zohoData),
  })
  return response.json()
}
