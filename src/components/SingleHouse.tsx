import { Data } from '@/types'
import { formatRupee } from '@/utils'
import { Link } from 'react-router-dom'

export default function SingleHouse({ data }: { data: Data }) {
  return (
    <Link key={data.Auction_id} to={`/properties/${data.Auction_id}`}>
      <div className='bg-white shadow-md rounded-md overflow-hidden cursor-pointer'>
        <img
          src='https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          alt={data.Account_Name}
          className='w-full h-52 object-cover'
        />
        <div className='flex justify-between items-center p-3'>
          <div>
            <h2 className='text-lg font-semibold'>
              ₹{formatRupee(data.Reserve_price)}
              {/* <span className='text-sm font-normal'>/month</span> */}
            </h2>
            {/* <p className='font-bold'>{data.name}</p> */}
            <p className='text-gray-500 text-sm'>{data.Area}</p>
          </div>
          {/* {<span className='text-yellow-500 text-sm'>🪙1 Coin</span>} */}
        </div>
      </div>
    </Link>
  )
}
