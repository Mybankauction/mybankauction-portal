import { Data } from '@/types'
import { formatRupee, readableDate } from '@/utils'
import { Image } from '@/utils/images'
import { Link } from 'react-router-dom'
import PropertyIcon from './PropertyIcon'
import { Button } from './ui/button'

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

export default function SingleHouse({ data }: { data: Data }) {
  return (
    <Link
      key={data.Auction_id}
      to={`/properties/${data.Auction_id}`}
      className='text-sm'
    >
      {/* min-w-[310px] */}
      <div className='bg-white shadow rounded overflow-hidden cursor-pointer '>
        <img
          src={PropertyImage(data.Property_Type)}
          alt={data.Account_Name}
          className='w-full h-52 object-cover'
        />
        <div className='p-3'>
          <div className='*:py-1 tracking-wide'>
            {/* <div className='flex items-center justify-between'> */}
            <p>
              💰{' '}
              <span className='font-semibold text-pretty'>
                Reserved Price:{' '}
              </span>
              ₹{formatRupee(data.Reserve_price)}
            </p>
            <div className='flex gap-1'>
              🏡
              <p>
                <span className='font-semibold text-pretty'>
                  Property Type:{' '}
                </span>{' '}
              </p>
              <p>{data.Property_Type}</p>
            </div>
            {/* </div> */}
            {/* {PropertyIcon(data.Property_Type, 22)} */}
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
                {readableDate(data.Auction_start_date)}
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
