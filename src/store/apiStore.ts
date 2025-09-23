import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dateOnly } from '@/utils'
import { getAuthToken } from '@/utils/api'

type Filters = {
  auctionStartDate?: string | null
  auctionEndDate?: string | null
  area?: string[]
  minPrice?: number
  maxPrice?: number
  propertyType?: string[]
  auctionId?: string
  state?: string
  city?: string
}

type ApiStoreState = {
  filters: Filters
  itemsPerPage: number
  data: any[] | null | undefined
  loading: boolean
  error: string | null
  totalItems: number
  totalPages: number
  clientPaginate: boolean
  setFilters: (filters: Filters) => void
  fetchData: (currentPage: any) => Promise<void>
  clearData: () => void // Add this method
}

const persistConfig = {
  name: 'apiStore',
  getStorage: () => localStorage,
}

export const useApiStore = create<ApiStoreState>()(
  persist(
    (set, get) => ({
      filters: {} as Filters,
      itemsPerPage: 12,
      data: null,
      loading: false,
      error: null,
      totalItems: 0,  
      totalPages: 0,
      clientPaginate: false,

      setFilters: (filters: Filters) => set({ filters }),

      clearData: () => set({ data: null }), // Add this method

      fetchData: async (currentPage: number) => {
        set({ loading: true, error: null })

        try {
          const { filters } = get()

          // Build query parameters for FastAPI
          const queryParams = new URLSearchParams()
          queryParams.append('page', currentPage.toString())

          const appendIfValue = (key: string, value: any) => {
            if (value === null || value === undefined) return
            if (typeof value === 'string' && value.trim() === '') return
            if (Array.isArray(value) && value.length === 0) return
            queryParams.append(key, String(value))
          }

          appendIfValue('auction_id', filters?.auctionId)
          appendIfValue('state', filters?.state)
          appendIfValue('city', filters?.city)

          if (filters?.area && filters.area.length) {
            queryParams.append('area', filters.area[0])
          }
          if (filters?.propertyType && filters.propertyType.length) {
            queryParams.append('property_type', filters.propertyType[0])
          }

          // Send date filters to backend now for server-side pagination
          appendIfValue('auction_start_date', filters?.auctionStartDate)
          appendIfValue('auction_end_date', filters?.auctionEndDate)

          const toNumericString = (v: unknown): string | null => {
            if (v === null || v === undefined) return null
            if (typeof v === 'number' && !isNaN(v)) return String(v)
            if (typeof v === 'string') {
              const cleaned = v.replace(/,/g, '').trim()
              if (cleaned === '') return null
              const parsed = Number(cleaned)
              return isNaN(parsed) ? null : String(parsed)
            }
            return null
          }

          const minStr = toNumericString(filters?.minPrice as unknown)
          const maxStr = toNumericString(filters?.maxPrice as unknown)
          if (minStr !== null) queryParams.append('min_price', minStr)
          if (maxStr !== null) queryParams.append('max_price', maxStr)

          const hasAnyFilters = Object.values(filters).some((value) => {
            if (value === null || value === undefined) return false
            if (typeof value === 'string') return value.trim() !== ''
            if (Array.isArray(value)) return value.length > 0
            return true
          })

          const endpoint = hasAnyFilters ? 'filtered.properties' : 'properties'
          const url = `https://mybankauction-backend-289962944772.us-east1.run.app/${endpoint}?${queryParams.toString()}`

          const token = getAuthToken()
          const response = await fetch(url, {
            headers: token ? { Authorization: `${token}` } : undefined,
          })

          console.log(response);
          

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()

          // Normalize to array for UI safety
          let normalized: any[] = []
          if (Array.isArray(result?.data)) {
            normalized = result.data
          } else if (result?.data && typeof result.data === 'object') {
            normalized = [result.data]
          } else if (Array.isArray(result)) {
            normalized = result
          } else {
            normalized = []
          }

          if (result.status === 200) {
            const totalItems = result?.pagination?.items ?? normalized.length ?? 0
            const totalPages = result?.pagination?.total_pages ?? (totalItems && get().itemsPerPage ? Math.ceil(totalItems / get().itemsPerPage) : 0)
            set({ data: normalized, loading: false, totalItems, totalPages, clientPaginate: false })
          } else {
            set({ data: [], loading: false, totalItems: 0, totalPages: 0, clientPaginate: false })
          }
        } catch (error: unknown) {
          console.error('Error fetching data:', error)
          set({
            error: 'Failed to fetch data. Please try again later.',
            loading: false,
            totalItems: 0,
            totalPages: 0,
            clientPaginate: false,
          })
        }
      },
    }),
    persistConfig
  )
)