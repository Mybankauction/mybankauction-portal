import { Data } from '@/types'
import { formatRupee, readableDate } from '@/utils'
import { Image } from '@/utils/images'
import { Link } from 'react-router-dom'
import PropertyIcon from './PropertyIcon'

function PropertyImage(type: string) {
  switch (type) {
    case 'Land':
      return Image.Land2
    case 'Flat':
      return Image.Flat
    case 'Land And Building':
      return Image.Land2
    case 'Plot':
      return Image.Land2
    case 'House':
      return Image.Flat
    default:
      return Image.Land2
  }
}

export default function SingleHouse({ data }: { data: Data }) {
  return (
    <Link key={data.Auction_id} to={`/properties/${data.Auction_id}`}>
      <div className='bg-white shadow rounded overflow-hidden cursor-pointer min-w-[310px]'>
        <img
          src={PropertyImage(data.Property_Type)}
          alt={data.Account_Name}
          className='w-full h-52 object-cover'
        />
        <div className=' p-3'>
          <div className=''>
            <div className='flex items-center justify-between'>
              <h2 className='font-semibold'>
                ₹{formatRupee(data.Reserve_price)}
              </h2>
              <div className='flex gap-1'>
                <p>{PropertyIcon(data.Property_Type, 22)}</p>
                <p className='text-sm'>{data.Property_Type}</p>
              </div>
            </div>
            <div className='flex items-center justify-between text-gray-500 text-sm mt-2'>
              <p className=''>{data.Area ? data.Area.name : 'N/A'}</p>
              <p>{readableDate(data.Auction_start_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
