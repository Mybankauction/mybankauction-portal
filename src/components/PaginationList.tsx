import SingleHouse from '@/components/SingleHouse'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { Data } from '@/types'
import { useEffect } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'

// import toast from 'react-hot-toast'

const PaginatedList = () => {
  const accessToken = useAccessToken()
  // const [currentPage, setCurrentPage] = useState(1)
  // const [totalItems, setTotalItems] = useState(0)
  // const itemsPerPage = 3

  const { data, fetchData, loading } = useApiStore()
  // const fetchTotalCount = async () => {
  //   if (!accessToken) return

  //   try {
  //     const response = await fetch(
  //       `/zoho/${API_ENDPOINT.PROPERTIES}/actions/count`,
  //       {
  //         headers: {
  //           Authorization: `Zoho-oauthtoken ${accessToken}`,
  //         },
  //       }
  //     )
  //     const result = await response.json()
  //     setTotalItems(result.count || 0)
  //   } catch (error) {
  //     console.error('Error fetching total count:', error)
  //   }
  // }

  // useEffect(() => {
  //   fetchTotalCount() // Fetch total count only once
  // }, [accessToken])

  useEffect(() => {
    fetchData(accessToken, 1) // Fetch paginated data on currentPage or accessToken change
  }, [accessToken])

  // const totalPages = Math.ceil(totalItems / itemsPerPage)
  // useEffect(() => {
  //   toast.success('You have recieved 10 free coins')
  // }, [])

  return (
    <>
      <div className='max-w-[1000px] w-full h-screen overflow-y-scroll px-2 md:px-5'>
        {loading ? (
          <div className='mx-auto mt-10'>
            <MagnifyingGlass
              visible={true}
              height='90'
              width='90'
              ariaLabel='magnifying-glass-loading'
              wrapperStyle={{
                margin: 'auto',
              }}
              wrapperClass='magnifying-glass-wrapper'
              glassColor='#c0efff'
              color='#e15b64'
            />
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 relative'>
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

            {/* {data.length > 0 && (
        <Pagination className='mb-10'>
          <PaginationContent>
            <PaginationItem className='select-none'>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`${
                  currentPage === 1
                    ? 'pointer-events-none cursor-not-allowed text-gray-400'
                    : 'cursor-pointer select-none'
                }`}
              />
            </PaginationItem>

            {Array.from({ length: data.length }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(index + 1)
                  }}
                  className={`rounded-full ${
                    currentPage === index + 1
                      ? 'bg-red-400 text-white hover:bg-red-400 hover:text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem className='select-none'>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }}
                className={`${
                  currentPage === totalPages
                    ? 'cursor-not-allowed pointer-events-none text-gray-400'
                    : 'cursor-pointer'
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )} */}
          </>
        )}
      </div>
    </>
  )
}

export default PaginatedList
