import Header from '@/components/Header'
import { convertDateToReadableFormat, formatRupee } from '@/utils'
import { ArrowLeft, CalendarDays, LandPlot, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MagnifyingGlass } from 'react-loader-spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuthToken, fetchInterestedProperties, postInterestedProperty } from '@/utils/api'

// Define the data type based on FastAPI backend model
interface PropertyData {
  _id: string
  account_name: string
  auction_id: string
  bank_name: string
  emd: string
  branch_name: string
  service_provider: string
  reserve_price: number
  contact_details: string
  description: string
  state: string
  city: string
  area: string
  borrower_name: string
  property_type: string
  auction_type: string
  sub_end: string
  sale_notice: string
  asset_category?: string
  outstanding_amount?: string
  auction_start_date: string
  auction_end_date: string
  [key: string]: any
}

export default function ItemDetails() {
  const { id } = useParams()
  const [data, setData] = useState<PropertyData>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [isInterested, setIsInterested] = useState(false)

  // Fetch property details
  async function fetchDetails() {
    try {
      setIsLoading(true)
      const token = getAuthToken()
      const res = await fetch(
        `https://mybankauction-backend-289962944772.us-east1.run.app/filtered.properties?auction_id=${id}`,
        {
          headers: token ? { Authorization: `${token}` } : undefined,
        }
      )

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const response = await res.json()

      if (response.status === 200 && response.data) {
        setData(response.data)
      } else {
        toast.error('Property not found')
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Error fetching property details:', error)
      toast.error('Failed to load property details')
      navigate('/', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle interested click
  const handleInterestedButtonClick = async () => {
    if (!data) return toast.error('Property data not available')

    const auctionId = data["Auction Id"]
    if (!auctionId) return toast.error('Auction ID not available')

    const existing: string[] = JSON.parse(localStorage.getItem('interestedAuctionIds') || '[]')

    if (existing.includes(auctionId)) {
      // Remove (toggle off)
      const updated = existing.filter((id: string) => id !== auctionId)
      localStorage.setItem('interestedAuctionIds', JSON.stringify(updated))
      setIsInterested(false)
      toast.success('Removed from interested list')
    } else {
      // Add (toggle on)
      existing.push(auctionId)
      localStorage.setItem('interestedAuctionIds', JSON.stringify(existing))
      setIsInterested(true)
      toast.success('Marked as Interested!')
    }

    // Call backend in background (does not block UI)
    try {
      if (data._id) {
        await postInterestedProperty({ property_id: data._id })
      }
    } catch (e) {
      console.error('Interest save error', e)
    }
  }

  // Restore isInterested state from localStorage
  useEffect(() => {
    if (data?.["Auction Id"]) {
      const existing: string[] = JSON.parse(localStorage.getItem('interestedAuctionIds') || '[]')
      setIsInterested(existing.includes(data["Auction Id"]))
    }
  }, [data])

  useEffect(() => {
    fetchDetails()
  }, [])

  return (
    <>
      <Header />
      <div className='max-w-[1300px] mt-5 mx-auto pb-20'>
        {isLoading ? (
          <div className='mx-auto mt-10 h-screen'>
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
          <>
            <div className='border p-4 bg-slate-100 rounded-md'>
              <div className='text-2xl font-bold flex items-center justify-between'>
                <p>
                  Auction for {data?.["Property Type"]} in {data?.["Area"] ?? 'N/A'},{' '}
                  {data?.["City"]} for ₹{formatRupee(data?.["Reserve Price"]?.toString() ?? '')}
                </p>
                <button
                  onClick={handleInterestedButtonClick}
                  className={`${
                    isInterested ? 'bg-green-400' : 'bg-red-400'
                  } text-base text-white px-2 py-1 rounded font-normal text-nowrap`}
                >
                  {isInterested ? 'Interested' : "I'm interested"}
                </button>
              </div>

              <div className='flex items-center justify-between flex-wrap gap-5 mt-6'>
                <div className='flex items-center gap-x-2'>
                  <p>
                    <LandPlot />
                  </p>
                  <p>{data?.["AssetCategory"] || 'N/A'}</p>
                </div>
                <div className='flex items-center gap-x-2'>
                  <p>
                    <MapPin />
                  </p>
                  <p>{data?.["City"]}</p>
                </div>
                <div className='flex items-center gap-x-2'>
                  <p>
                    <CalendarDays />
                  </p>
                  <p>
                    {data?.auction_start_date
                      ? convertDateToReadableFormat(data?.auction_start_date)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between flex-wrap gap-5'>
              <h1 className='font-bold text-xl pb-4 underline'>Bank Details:</h1>
              <div className='flex items-center gap-20 flex-wrap'>
                <div className='*:py-2'>
                  <div>
                    <span className='font-bold'>Bank Name:</span> {data?.["Bank Name"]}
                  </div>
                  <div>
                    <span className='font-bold'>EMD:</span> ₹
                    {formatRupee(data?.["EMD"] ?? '')}
                  </div>
                  <div>
                    <span className='font-bold'>Branch Name:</span> {data?.["Branch Name"]}
                  </div>
                </div>
                <div className='*:py-2'>
                  <p>
                    <span className='font-bold'>Reserve Price:</span> ₹
                    {formatRupee(data?.["Reserve Price"]?.toString() ?? '')}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between gap-5 '>
              <h1 className='font-bold text-xl pb-4 underline'>
                Property Details:
              </h1>
              <div className='flex items-center gap-20 flex-wrap'>
                <div className='*:py-2'>
                  <div>
                    <span className='font-bold'>Auction Id:</span> {data?.["Auction Id"] || 'N/A'}
                  </div>
                  <div>
                    <span className='font-bold'>Borrower Name:</span> {data?.["Borrower Name"] || 'N/A'}
                  </div>
                  <div>
                    <span className='font-bold'>Asset Category:</span> {data?.["AssetCategory"] || 'N/A'}
                  </div>
                  <div>
                    <span className='font-bold'>Property Type:</span> {data?.["Property Type"]}
                  </div>
                  <div>
                    <span className='font-bold'>Auction Type:</span> {data?.["Auction Type"]}
                  </div>
                </div>
                <div className='*:py-2'>
                  <p>
                    <span className='font-bold'>Auction Start Date:</span>{' '}
                    {data?.auction_start_date
                      ? convertDateToReadableFormat(data?.auction_start_date)
                      : 'N/A'}
                  </p>
                  <p>
                    <span className='font-bold'>Auction End Date:</span>{' '}
                    {data?.auction_end_date
                      ? convertDateToReadableFormat(data?.auction_end_date)
                      : 'N/A'}
                  </p>
                  <p>
                    <span className='font-bold'>Service Provider:</span> {data?.["Service Provider"] || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between flex-wrap gap-5 '>
              <h1 className='font-bold text-xl pb-4 underline'>
                Property Description:{' '}
              </h1>
              <p className='leading-7 mb-2'>
                <span className='font-bold'>
                  Description : 
                </span>
                {data?.Description
                  ? data.Description
                  : 'No description available for this property.'}
              </p>
              <div className='flex items-center justify-between *:py-2'>
                <p>
                  <span className='font-bold'>State:</span> {data?.["State"]}
                </p>
                <p>
                  <span className='font-bold'>City:</span> {data?.["City"]}
                </p>
                <p>
                  <span className='font-bold'>Area:</span> {data?.["Area"]}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
