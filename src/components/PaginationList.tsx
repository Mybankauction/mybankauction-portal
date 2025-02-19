import SingleHouse from '@/components/SingleHouse'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { Data } from '@/types'
import { Fragment, useEffect, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import { ScrollArea } from './ui/scroll-area'

import { API_BASE_URL, API_ENDPOINT } from '@/conf'
import Loader from './Loader'
import { Button } from './ui/button'

const PaginatedList = () => {
  const { accessToken } = useAccessToken()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const { data, fetchData, loading, itemsPerPage, filters } = useApiStore()
  const fetchTotalCount = async () => {
    if (!accessToken) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/${API_ENDPOINT.PROPERTIES}/actions/count`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      )
      const result = await response.json()
      setTotalItems(result.count || 0)
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }

  const handleLoadMore = () => {
    fetchData(accessToken, currentPage + 1)
    setCurrentPage((prevPage) => prevPage + 1)
  }

  useEffect(() => {
    fetchTotalCount()
  }, [accessToken])

  useEffect(() => {
    fetchData(accessToken, currentPage)
  }, [accessToken, currentPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const anyFiltersApplied = () => {
    return (
      filters.auctionStartDate ||
      filters.auctionEndDate ||
      (filters.area && filters.area.length > 0) ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.auctionId ||
      (filters.propertyType && filters.propertyType.length > 0)
    )
  }

  return (
    <div className='max-w-[1000px] w-full min-h-[300px] h-[calc(100vh-100px)] overflow-y-scroll px-2 md:px-5'>
      {!loading ? (
        <div className='mx-auto'>
          {/* grid-cols-1 sm:grid-cols-2 */}
          <div className='grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8 relative'>
            {data ? (
              data?.map((item: Data) => (
                <SingleHouse key={item.Auction_id} data={item} />
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
      {!loading &&
        data?.length! > 0 &&
        currentPage < totalPages &&
        !anyFiltersApplied() && (
          <div>
            <Button
              className='bg-red-400 block mx-auto hover:bg-red-600'
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          </div>
        )}
    </div>
  )
}

export default PaginatedList
