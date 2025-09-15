import { formatRupee, readableDate } from '@/utils'
import { Image } from '@/utils/images'
import { Link } from 'react-router-dom'
import PropertyIcon from './PropertyIcon'
import { Button } from './ui/button'

// Define the data type based on FastAPI backend model
interface PropertyData {
  _id: string
  "Account name": string
  "Auction Id": string
  "Bank Name": string
  EMD: string
  "Branch Name": string
  "Service Provider": string
  "Reserve Price": string | number
  "Contact Details": string
  Description: string
  State: string
  City: string
  Area: string
  "Borrower Name": string
  "Property Type": string
  "Auction Type": string
  "Sub End": string
  sale_notice: string
  AssetCategory?: string
  outstanding_amount?: string
  auction_start_date: string
  auction_end_date: string
}

function PropertyImage(type: string) {
  switch (type) {
    case 'Land':
      return Image.Land3
    case 'Flat':
      return Image.Flat
    case 'Land And Building':
      return Image.LandAndBuilding
    case 'Plot':
      return Image.Plot
    case 'House':
      return Image.House
    default:
      return Image.Plot
  }
}

export default function SingleHouse({ data }: { data: PropertyData }) {
  
  return (
    <Link
      key={data["Auction Id"]}
      to={`/properties/${data["Auction Id"]}`}
      className='text-sm'
    >
      {/* min-w-[310px] */}
      <div className='bg-white shadow rounded overflow-hidden cursor-pointer '>
        <img
          src={PropertyImage(data["Property Type"])}
          alt={data["Account name"]}
          className='w-full h-52 object-cover'
        />
        <div className='p-3'>
          <div className='*:py-1 tracking-wide'>
            {/* <div className='flex items-center justify-between'> */}
            <p>
              #️⃣ <span className='font-semibold text-pretty'>Auction Id: </span>
              {data["Auction Id"]}
            </p>
            <p>
              💰{' '}
              <span className='font-semibold text-pretty'>
                Reserved Price:{' '}
              </span>
              ₹{formatRupee(data["Reserve Price"].toString())}
            </p>
            <div className='flex gap-1'>
              🏡
              <p>
                <span className='font-semibold text-pretty'>
                  Property Type:{' '}
                </span>{' '}
              </p>
              <p>{data["Property Type"]}</p>
            </div>
            {/* </div> */}
            {/* {PropertyIcon(data.property_type, 22)} */}
            {/* <div className='flex items-center justify-between text-gray-500 text-sm mt-2'> */}
            <p>
              📍
              <span className='font-semibold'> Location: </span>
              {data.Area ? data.Area : 'N/A'}
            </p>
            <div className='flex'>
              ⏳
              <p>
                <span className='font-semibold'> Auction start: </span>
                {readableDate(data.auction_start_date)}
              </p>
            </div>
            <p>
              <Button
                size={'xs'}
                variant={'outline'}
                // className='bg-red-400 hover:bg-red-400'
                className='mt-1'
              >
                View More
              </Button>
            </p>
            {/* </div> */}
          </div>
        </div>
      </div>
    </Link>
  )
}
