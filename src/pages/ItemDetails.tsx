import Header from '@/components/Header'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { convertDateToReadableFormat, formatRupee } from '@/utils'
import { ArrowLeft, CalendarDays, Heart, LandPlot, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MagnifyingGlass } from 'react-loader-spinner'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [submittingPhone, setSubmittingPhone] = useState(false)

  useEffect(() => {
    async function syncInterestedFromServer() {
      try {
        const list = await fetchInterestedProperties()
        const exists = Array.isArray(list) && list.some((item: any) => item?.["Auction Id"] === data?.["Auction Id"]) 
        setIsInterested(Boolean(exists))
      } catch {
        // ignore
      }
    }
    if (data?.["Auction Id"]) {
      syncInterestedFromServer()
    }
  }, [data])

  async function fetchDetails() {
    try {
      setIsLoading(true)
      const token = getAuthToken()
      const res = await fetch(`https://mybankauction-backend-289962944772.us-east1.run.app/filtered.properties?auction_id=${id}` , {
        headers: token ? { Authorization: `${token}` } : undefined,
      })
      
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

  const handleInterestedButtonClick = async () => {
    const isLoggedin = localStorage.getItem('isLoggedin')

    if (!isLoggedin || isLoggedin !== 'true') {
      toast.error('You need to first login')
      return
    }

    if (!data) {
      toast.error('Property data not available')
      return
    }

    // First time: if user hasn't submitted phone yet, open dialog when server list is empty
    const alreadyAsked = localStorage.getItem('phone_number_submitted') === 'true'
    if (!alreadyAsked) {
      try {
        const serverInterested = await fetchInterestedProperties()
        const hasAny = Array.isArray(serverInterested) && serverInterested.length > 0
        if (!hasAny) {
          setShowPhoneDialog(true)
          return
        }
      } catch (e) {
        // If fetching interested list fails (e.g., token/first-time), still prompt for phone
        setShowPhoneDialog(true)
        return
      }
    }

    // Always post interest for this property to backend
    try {
      if (!data._id) {
        toast.error('Property id not available')
        return
      }
      await postInterestedProperty({ property_id: data._id })
      toast.success('Added to your interested properties!')
      setIsInterested(true)
    } catch (e) {
      console.error('Interest save error', e)
      toast.error('Failed to add to interested properties')
      return
    }

    const interestedProperty = {
      auction_id: data["Auction Id"],
      property_type: data["Property Type"],
      city: data["City"],
      area: data["Area"],
      reserve_price: data["Reserve Price"],
      bank_name: data["Bank Name"],
      auction_start_date: data.auction_start_date,
      auction_end_date: data.auction_end_date,
      interested_at: new Date().toISOString()
    }

    const existingDeals = JSON.parse(
      localStorage.getItem('interestedDeals') || '[]'
    )

    // Toggle interest: add if not exists, otherwise remove
    const alreadyExists = existingDeals.some(
      (deal: any) => deal.auction_id === interestedProperty.auction_id
    )

    if (!alreadyExists) {
      existingDeals.push(interestedProperty)
      localStorage.setItem('interestedDeals', JSON.stringify(existingDeals))
      setIsInterested(true)
    } else {
      const updatedDeals = existingDeals.filter(
        (deal: any) => deal.auction_id !== interestedProperty.auction_id
      )
      localStorage.setItem('interestedDeals', JSON.stringify(updatedDeals))
      setIsInterested(false)
      toast.success('Removed from your interested properties')
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [])

  return (
    <>
    <Header/>
    <div className='max-w-[1300px] mt-5 mx-auto pb-20'>
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your phone number</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-3 w-full'>
            <input
              type='tel'
              className='border rounded px-3 py-2'
              placeholder='e.g. 95979xxxxx'
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
            <div className='flex gap-2 justify-end'>
              <button
                className='px-4 py-2 rounded bg-neutral-200'
                onClick={() => setShowPhoneDialog(false)}
                disabled={submittingPhone}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 rounded bg-red-400 text-white disabled:opacity-50'
                onClick={async () => {
                  const trimmed = phoneInput.trim()
                  if (!/^\+?[0-9\s-]{10,13}$/.test(trimmed)) {
                    toast.error('Please enter a valid phone number')
                    return
                  }
                  if (!data?._id) {
                    toast.error('Property id not available')
                    return
                  }
                  try {
                    setSubmittingPhone(true)
                    await postInterestedProperty({ property_id: data._id, phone_number: trimmed })
                    localStorage.setItem('phone_number_submitted', 'true')
                    toast.success('Phone saved and interest registered')
                    setShowPhoneDialog(false)
                    setIsInterested(true)
                  } catch (e) {
                    console.error(e)
                    toast.error('Failed to register interest')
                  } finally {
                    setSubmittingPhone(false)
                  }
                }}
                disabled={submittingPhone}
              >
                {submittingPhone ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <div className='mx-auto mt-10 h-screen'>
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
          <div>
            <Link to={'/properties'}>
              <Button variant={'link'} className='text-red-400'>
                <ArrowLeft />
                Go back
              </Button>
            </Link>
          </div>
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
                {/* <Heart
                  className='text-red-400'
                  fill={isInterested ? 'red' : 'white'}
                  size={30}
                /> */}
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
          {/*  */}
          <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between flex-wrap gap-5'>
            <h1 className='font-bold text-xl pb-4 underline'>Bank Details:</h1>
            <div className='flex items-center gap-20 flex-wrap'>
              <div className='*:py-2'>
                <div>
                  <span className='font-bold'>Bank Name:</span>{' '}
                  {data?.["Bank Name"]}
                </div>
                <div>
                  <span className='font-bold'>EMD:</span> ₹
                  {formatRupee(data?.["EMD"] ?? '')}
                </div>
                <div>
                  <span className='font-bold'>Branch Name:</span>{' '}
                  {data?.["Branch Name"]}
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
          {/*  */}
          <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between gap-5 '>
            <h1 className='font-bold text-xl pb-4 underline'>
              Property Details:
            </h1>
            <div className='flex items-center gap-20 flex-wrap'>
              <div className='*:py-2'>
                <div>
                  <span className='font-bold'>Auction Id:</span>{' '}
                  {data?.["Auction Id"] || 'N/A'}
                </div>
                <div>
                  <span className='font-bold'>Borrower Name:</span>{' '}
                  {data?.["Borrower Name"] || 'N/A'}
                </div>
                <div>
                  <span className='font-bold'>Asset Category:</span>{' '}
                  {data?.["AssetCategory"] || 'N/A'}
                </div>
                <div>
                  <span className='font-bold'>Property Type:</span>{' '}
                  {data?.["Property Type"]}
                </div>
                <div>
                  <span className='font-bold'>Auction Type:</span>{' '}
                  {data?.["Auction Type"]}
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
                  {data?.auction_start_date
                    ? convertDateToReadableFormat(data?.auction_start_date)
                    : 'N/A'}
                </p>
                <p>
                  <span className='font-bold'>Service Provider:</span>{' '}
                  {data?.["Service Provider"] || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between flex-wrap gap-5 '>
            <h1 className='font-bold text-xl pb-4 underline'>
              Property Description:{' '}
            </h1>

            <p>
              {data?.["Description"]
                ? data.description
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
            <div className='mt-4'>
              
            </div>
          </div>
          {/*  */}
          {/* <div className='bg-slate-100 mt-5 p-5'>
        <p className='font-bold'>Downloads:</p>
        <a target='_blank' href={data?.Download_sales_notice}>
          <img
            src='https://www.eauctionsindia.com/assets/icons/pdf-file.png'
            // style='width:64px;height:64px'
            alt='Sale Notice 1'
          />
        </a>
      </div> */}
        </>
      )}
    </div>
    </>
  )
}

