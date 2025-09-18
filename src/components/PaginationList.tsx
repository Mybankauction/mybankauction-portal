import SingleHouse from '@/components/SingleHouse'
import { useApiStore } from '@/store/apiStore'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import { ScrollArea } from './ui/scroll-area'

import Loader from './Loader'
import { Button } from './ui/button'

const PaginatedList = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, fetchData, loading, itemsPerPage, filters, totalItems, totalPages } = useApiStore()
  console.log(data);
  
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  // Refetch when filters change and reset to first page
  useEffect(() => {
    setCurrentPage(1)
    fetchData(1)
  }, [filters])

  // Clamp current page to totalPages when using server pagination
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
      fetchData(totalPages)
    }
  }, [totalPages])

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return data
  }, [data])

  const anyFiltersApplied = () => {
    return (
      filters.auctionStartDate ||
      filters.auctionEndDate ||
      (filters.area && filters.area.length > 0) ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.auctionId ||
      filters.state ||
      filters.city ||
      (filters.propertyType && filters.propertyType.length > 0)
    )
  }

  return (
    <div className='max-w-[1000px] w-full min-h-[300px] h-[85vh] overflow-y-scroll px-2 md:px-5'>
      {!loading ? (
        <div className='mx-auto'>
          {/* grid-cols-1 sm:grid-cols-2 */}
          <div className='grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8 relative'>
            {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (
                <SingleHouse key={item["Auction Id"]} data={item} />
              ))
            ) : (
              <div className='flex h-full absolute top-14 left-[50%] transform -translate-x-1/2 -translate-y-1/2'>
                <h1 className='text-xl md:text-4xl font-bold text-center text-gray-400'>
                  Nothing to show
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
        <div className='flex justify-center items-center gap-2 mt-8'>
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1)
                fetchData(currentPage - 1)
              }
            }}
            disabled={currentPage === 1}
            className='px-3 py-1'
          >
            Previous
          </Button>

          {/* Page numbers */}
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
                  onClick={() => {
                    setCurrentPage(pageNum)
                    fetchData(pageNum)
                  }}
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

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1)
                fetchData(currentPage + 1)
              }
            }}
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
