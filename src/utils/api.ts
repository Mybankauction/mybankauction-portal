import { API_BASE_URL, API_ENDPOINT } from '@/conf'

// Authentication API functions
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    full_name: string
    email: string
  }
}

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_ENDPOINT.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Backend returns: {"login_success_message": true, "token": "..."}
    if (data.login_success_message && data.token) {
      return {
        success: true,
        token: data.token,
        message: 'Login successful'
      }
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }
}

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token ?? null
  } catch {
    return null
  }
}

// Interested properties
export async function fetchInterestedProperties(): Promise<any[]> {
  const token = getAuthToken()
  const res = await fetch(`${API_BASE_URL}/${API_ENDPOINT.INTERESTED_PROPERTIES}` , {
    headers: token ? { Authorization: `${token}` } : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Failed to fetch interested properties')
  return data?.data ?? []
}

export async function postInterestedProperty(payload: { property_id: string, phone_number?: string }): Promise<{ success: boolean }> {
  const token = getAuthToken()
  const res = await fetch(`${API_BASE_URL}/${API_ENDPOINT.INTERESTED_PROPERTY}` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok && res.status !== 201) throw new Error(data?.message || 'Failed to save interested property')
  return { success: true }
}

export async function registerUser(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_ENDPOINT.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    console.log("register Data",data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    // Backend returns: "User registered successfully" on success
    if (response.status === 201) {
      return {
        success: true,
        message: 'User registered successfully'
      }
    } else {
      throw new Error('Registration failed')
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed')
  }
}
