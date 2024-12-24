import { API_ENDPOINT } from '@/conf'
import { create } from 'zustand'

type Filters = {
  auctionStartDate?: string | null
  auctionEndDate?: string | null
  area?: string
  minPrice?: number
  maxPrice?: number
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

export const useApiStore = create<ApiStoreState>((set) => ({
  filters: {} as Filters,
  itemsPerPage: 300,
  data: [],
  loading: false,
  error: null,

  setFilters: (filters: Filters) => set({ filters }),

  fetchData: async (accessToken: string, currentPage: any) => {
    set({ loading: true, error: null })

    const { filters, itemsPerPage } = useApiStore.getState()

    // Construct criteria
    const criteriaParts: string[] = []
    if (filters.auctionStartDate) {
      criteriaParts.push(
        `(Auction_start_date:greater_than:${filters.auctionStartDate})`
      )
    }
    if (filters.auctionEndDate) {
      criteriaParts.push(
        `(Auction_end_date:less_than:${filters.auctionEndDate})`
      )
    }
    if (filters.area) {
      criteriaParts.push(`(Area:equals:${filters.area})`)
    }
    if (filters.minPrice) {
      criteriaParts.push(`(Reserve_price:greater_than:${filters.minPrice})`)
    }
    if (filters.maxPrice) {
      criteriaParts.push(`(Reserve_price:less_than:${filters.maxPrice})`)
    }

    const criteria = criteriaParts.join('and')
    const encodedCriteria = encodeURIComponent(criteria)

    const url = `/.netlify/functions/proxy/zoho/${API_ENDPOINT.SEARCH}?criteria=Reserve_price:greater_than:0${encodedCriteria}&page=${currentPage}&per_page=${itemsPerPage}`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      })
      // const result = await response.json()
      // set({ data: result.data, loading: false })

      if (response.status === 204) {
        set({ data: null, loading: false }) // Handle no content
      } else if (response.ok) {
        const result = await response.json()
        set({ data: result.data, loading: false })
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      // @ts-ignore
      set({ error: error.message, loading: false })
    }
  },
}))
