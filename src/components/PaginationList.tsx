import SingleHouse from '@/components/SingleHouse'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { Data } from '@/types'
import { useEffect, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import { ScrollArea } from './ui/scroll-area'

import { API_BASE_URL, API_ENDPOINT } from '@/conf'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

const PaginatedList = () => {
  const accessToken = useAccessToken()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const { data, fetchData, loading, itemsPerPage } = useApiStore()
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

  useEffect(() => {
    fetchTotalCount()
  }, [accessToken])

  useEffect(() => {
    fetchData(accessToken, currentPage)
  }, [accessToken, currentPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // console.log({ totalItems }, { totalPages })
  return (
    <div className='max-w-[1000px] w-full min-h-[300px] h-[calc(100vh-100px)] overflow-y-scroll px-2 md:px-5'>
      {loading ? (
        <div className='mx-auto mt-10'>
          <MagnifyingGlass
            visible={true}
            height='90'
            width='90'
            ariaLabel='magnifying-glass-loading'
            wrapperStyle={{ margin: 'auto' }}
            wrapperClass='magnifying-glass-wrapper'
            glassColor='#c0efff'
            color='#e15b64'
          />
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 relative'>
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
      )}

      {/* Pagination */}
      {!loading && data && data?.length > 0 && (
        <div className='mt-8'>
          <Pagination className='my-10 max-w-[1000px] w-full mx-auto'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={cn({
                    'pointer-events-none cursor-not-allowed text-gray-400':
                      currentPage === 1,
                    'cursor-pointer': currentPage > 1,
                  })}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(index + 1)
                    }}
                    className={cn('rounded-full', {
                      'bg-red-400 text-white': currentPage === index + 1,
                      'text-gray-700': currentPage !== index + 1,
                    })}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }}
                  className={cn({
                    'pointer-events-none cursor-not-allowed text-gray-400':
                      currentPage === totalPages,
                    'cursor-pointer': currentPage < totalPages,
                  })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default PaginatedList
