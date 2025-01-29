import { API_BASE_URL, API_ENDPOINT } from '@/conf'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Filters = {
  auctionStartDate?: string | null
  auctionEndDate?: string | null
  area?: string[]
  minPrice?: number
  maxPrice?: number
  propertyType?: string[]
  auctionId?: string
}

type ApiStoreState = {
  filters: Filters
  itemsPerPage: number
  data: any[] | null | undefined
  loading: boolean
  error: string | null
  setFilters: (filters: Filters) => void
  fetchData: (accessToken: string, currentPage: any) => Promise<void>
}

const persistConfig = {
  name: 'apiStore',
  getStorage: () => localStorage,
}

export const useApiStore = create<ApiStoreState>()(
  persist(
    (set, get) => ({
      filters: {} as Filters,
      itemsPerPage: 21,
      data: null,
      loading: false,
      error: null,

      setFilters: (filters: Filters) => set({ filters }),

      fetchData: async (accessToken: string, currentPage: number) => {
        set({ loading: true, error: null })

        try {
          const { filters, itemsPerPage } = get()

          const criteriaParts: string[] = []
          if (filters?.auctionStartDate) {
            criteriaParts.push(
              `(Auction_start_date:greater_than:${filters.auctionStartDate})`
            )
          }
          if (filters?.auctionEndDate) {
            criteriaParts.push(
              `(Auction_end_date:less_than:${filters.auctionEndDate})`
            )
          }
          if (filters?.minPrice) {
            criteriaParts.push(
              `(Reserve_price:greater_than:${filters.minPrice})`
            )
          }
          if (filters?.maxPrice) {
            criteriaParts.push(`(Reserve_price:less_than:${filters.maxPrice})`)
          }
          if (filters?.auctionId) {
            criteriaParts.push(`(Auction_id:equals:${filters.auctionId})`)
          }
          if (filters?.propertyType?.length) {
            criteriaParts.push(
              `(Property_Type:in:${filters.propertyType.join(',')})`
            )
          }
          if (filters?.area?.length) {
            criteriaParts.push(`(Area:in:${filters.area.join(',')})`)
          }

          const criteria = criteriaParts.join('and')
          const encodedCriteria = encodeURIComponent(criteria)

          const url = `${API_BASE_URL}/${API_ENDPOINT.SEARCH}?${
            criteria
              ? `criteria=${encodedCriteria}`
              : 'criteria=(Reserve_price:greater_than:0)'
          }&page=${currentPage}&per_page=${itemsPerPage}`

          const response = await fetch(url, {
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
          })

          if (response.status === 204) {
            set({ data: null, loading: false })
          } else if (response.ok) {
            const result = await response.json()
            set({ data: result.data, loading: false })
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        } catch (error: unknown) {
          console.error('Error fetching data:', error)
          set({
            error: 'Failed to fetch data. Please try again later.',
            loading: false,
          })
        }
      },
    }),
    persistConfig
  )
)
