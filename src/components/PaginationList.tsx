import SingleHouse from '@/components/SingleHouse'
import { useApiStore } from '@/store/apiStore'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Loader from './Loader'
import { Button } from './ui/button'

const PaginatedList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const previousFiltersRef = useRef<string>('')
  
  // Get page from URL, default to 1 if not present or invalid
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page')
    const page = pageParam ? parseInt(pageParam, 10) : 1
    return isNaN(page) || page < 1 ? 1 : page
  }, [searchParams])

  const { data, fetchData, loading, filters, totalPages, clearData } = useApiStore()
  
  // Convert filters to string for comparison
  const filtersString = JSON.stringify(filters)
  
  // Handle filters change - reset to page 1
  useEffect(() => {
    if (previousFiltersRef.current && previousFiltersRef.current !== filtersString) {
      // Filters changed, reset to page 1
      setSearchParams({ page: '1' })
      clearData()
    }
    previousFiltersRef.current = filtersString
  }, [filtersString])

  // Fetch data when currentPage changes
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  // Clamp current page to totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setSearchParams({ page: totalPages.toString() })
    }
  }, [totalPages, currentPage, setSearchParams])

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return data
  }, [data])

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      clearData()
      setSearchParams({ page: newPage.toString() })
    }
  }

  return (
    <div className='max-w-full w-full min-h-[300px]'>
      {!loading ? (
        <div className='mx-auto'>
          <div className='flex flex-col gap-5 mb-8 relative'>
            {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (
                <SingleHouse key={item["Auction Id"]} data={item} />
              ))
            ) : (
              <div className='flex h-full absolute top-14 left-[50%] transform -translate-x-1/2 -translate-y-1/2'>
                <h1 className='text-xl md:text-4xl font-bold text-center text-gray-400'>
                  NO PROPERTY FOUND
                </h1>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 relative'>
          {Array.from({ length: 21 }, (_, idx) => (
            <Fragment key={idx}>
              <Loader />
            </Fragment>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && Array.isArray(paginatedData) && paginatedData.length > 0 && totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 my-8'>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-3 py-1'
          >
            Previous
          </Button>

          <div className='flex gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 ${
                    currentPage === pageNum 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-3 py-1'
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default PaginatedList