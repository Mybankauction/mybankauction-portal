import { Button } from '@/components/ui/button'
import { API_BASE_URL, API_ENDPOINT } from '@/conf'
import useAccessToken from '@/hooks/useAccessToken'
import { Data } from '@/types'
import { convertDateToReadableFormat, formatRupee } from '@/utils'
import { ArrowLeft, CalendarDays, Heart, LandPlot, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MagnifyingGlass } from 'react-loader-spinner'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function ItemDetails() {
  const { accessToken, refreshToken } = useAccessToken()
  const { id } = useParams()
  const [data, setData] = useState<Data>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [isInterested, setIsInterested] = useState(false) // Initial button color

  useEffect(() => {
    const existingDeals = JSON.parse(
      localStorage.getItem('interestedDeals') || '[]'
    )
    const dealExists = existingDeals.some(
      (deal: any) => deal.data[0].Account_Name.id === data?.id
    )

    setIsInterested(dealExists ? true : false)
  }, [data])

  async function fetchDetails() {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${API_BASE_URL}/${API_ENDPOINT.SEARCH}?criteria=Auction_id:equals:${id}`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      )
      if (res.status === 401) {
        refreshToken()
        console.log('its 401 ', accessToken)
      }
      if (res.status === 204) {
        navigate('*', { replace: true })
        return
      }
      const _data = await res.json()
      setData(_data.data[0])
    } catch (error) {
      // @ts-ignore
      toast.error(error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAccountIdDetails = async (id: string | undefined) => {
    const res = await fetch(
      `${API_BASE_URL}/${API_ENDPOINT.SEARCH}?criteria=Auction_id:equals:${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json()
    return data.data[0]
  }
  const handleInterestedButtonClick = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'defaultContactId')
    const isLoggedin = localStorage.getItem('isLoggedin')

    if (!isLoggedin) {
      toast.error('You need to first login')
      return
    }

    if (isLoggedin !== 'true') {
      toast.error('You need to first login')
      return
    }

    setIsInterested(true)
    const contactId = user.id
    const userName = user.Name1
    const acc = await fetchAccountIdDetails(id)

    const newDeal = {
      id: acc.id,
      data: [
        {
          Deal_Name: `${acc.Account_Name}-${userName}`,
          Stage: 'Physical Property Scan',
          Account_Name: {
            id: acc.id,
          },
          Contact_Name: {
            id: contactId,
          },
        },
      ],
    }

    const res = await fetch(`${API_BASE_URL}/${API_ENDPOINT.DEAL}`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDeal),
    })

    const _data = await res.json()
    console.log(_data)

    const existingDeals = JSON.parse(
      localStorage.getItem('interestedDeals') || '[]'
    )

    // Check for duplicates based on Account_Name id
    if (
      !existingDeals.some(
        (deal: any) =>
          deal.data[0].Account_Name.id === newDeal.data[0].Account_Name.id
      )
    ) {
      existingDeals.push(newDeal)
      localStorage.setItem('interestedDeals', JSON.stringify(existingDeals))
      // console.log('Updated deals in localStorage:', existingDeals)
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [])

  return (
    <div className='max-w-[980px] mx-auto pb-20'>
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
            <Link to={'/'}>
              <Button variant={'link'} className='text-red-400'>
                <ArrowLeft />
                Go back
              </Button>
            </Link>
          </div>
          <div className='border p-4 bg-slate-100 rounded-md'>
            <div className='text-2xl font-bold flex items-center justify-between'>
              <p>
                {/* {data?.Bank_Name} Auctions for {data?.Property_Type} in{' '}
                {data?.Area?.name ?? 'N/A'}, {data?.City} */}
                Auction for {data?.Property_Type} in {data?.Area ?? 'N/A'},{' '}
                {data?.City.name} for ₹{formatRupee(data?.Reserve_price! ?? '')}
              </p>
              <button
                onClick={handleInterestedButtonClick}
                disabled={isInterested}
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
                <p>{data?.Asset_Category}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <p>
                  <MapPin />
                </p>

                <p>{data?.City.name}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <p>
                  <CalendarDays />
                </p>
                <p>
                  {data?.Auction_start_date
                    ? convertDateToReadableFormat(data?.Auction_start_date)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {/*  */}
          <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between flex-wrap gap-5'>
            <h1 className='font-bold text-xl pb-4 underline'>Bank Details:</h1>
            <div className='flex items-center gap-6 flex-wrap'>
              <div className='*:py-2'>
                <div>
                  <span className='font-bold'>Bank Name:</span>{' '}
                  {data?.Bank_Name}
                </div>
                <div>
                  <span className='font-bold'>EMD:</span> ₹
                  {formatRupee(data?.Earnest_Money_Deposit ?? '')}
                </div>
                <div>
                  <span className='font-bold'>Branch Name:</span>{' '}
                  {data?.Branch_Name}
                </div>
              </div>
              <div className='*:py-2'>
                <p>
                  <span className='font-bold'>Reserve Price:</span> ₹
                  {formatRupee(data?.Reserve_price ?? '')}
                </p>
                <p>
                  <span className='font-bold'>Current Price: </span>₹
                  {data?.Current_market_price
                    ? formatRupee(data?.Current_market_price ?? '')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {/*  */}
          <div className='p-4 bg-slate-100 mt-5 rounded-md justify-between gap-5 '>
            <h1 className='font-bold text-xl pb-4 underline'>
              Property Details:
            </h1>
            <div className='flex items-center gap-6 flex-wrap'>
              <div className='*:py-2'>
                <div>
                  <span className='font-bold'>Auction Id:</span>{' '}
                  {data?.Auction_id}
                </div>
                <div>
                  <span className='font-bold'>Borrower Name:</span>{' '}
                  {data?.Borrower_Name}
                </div>
                <div>
                  <span className='font-bold'>Asset Category:</span>{' '}
                  {data?.Asset_Category}
                </div>
                <div>
                  <span className='font-bold'>Property Type:</span>{' '}
                  {data?.Property_Type}
                </div>
                <div>
                  <span className='font-bold'>Auction Type:</span>{' '}
                  {data?.Auction_Type}
                </div>
              </div>
              <div className='*:py-2'>
                <p>
                  <span className='font-bold'>Auction Start Time:</span>{' '}
                  {data?.Auction_start_date
                    ? convertDateToReadableFormat(data?.Auction_start_date)
                    : 'N/A'}
                </p>
                <p>
                  <span className='font-bold'>Auction End Time:</span>{' '}
                  {convertDateToReadableFormat(data?.Auction_end_date)}
                </p>
                <p>
                  <span className='font-bold'>
                    Application Submission Date:
                  </span>{' '}
                  {convertDateToReadableFormat(
                    data?.Last_date_to_submit_the_tender_form_for_theauction
                  )}
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
              {data?.Property_Description
                ? data.Property_Description
                : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos obcaecati praesentium magnam perferendis deserunt maxime aliquam iste facilis perspiciatis facere.'}
            </p>
            <div className='flex items-center justify-between *:py-2'>
              <p>
                <span className='font-bold'>State:</span> {data?.State}
              </p>
              <p>
                <span className='font-bold'>City:</span> {data?.City.name}
              </p>
              <p>
                <span className='font-bold'>Area:</span> {data?.Area}
              </p>
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
  )
}
