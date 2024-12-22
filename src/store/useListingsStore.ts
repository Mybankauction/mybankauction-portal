import { create } from 'zustand'

interface ListingsStore {
  listings: any[]
  totalCount: number
  isFiltering: boolean
  currentPage: number
  setListings: (data: any[]) => void
  setTotalCount: (count: number) => void
  setIsFiltering: (filtering: boolean) => void
  setCurrentPage: (page: number) => void
}

const useListingsStore = create<ListingsStore>((set) => ({
  listings: [],
  totalCount: 0,
  isFiltering: false,
  currentPage: 1,
  setListings: (data) => set({ listings: data }),
  setTotalCount: (count) => set({ totalCount: count }),
  setIsFiltering: (filtering) => set({ isFiltering: filtering }),
  setCurrentPage: (page) => set({ currentPage: page }),
}))

export default useListingsStore
