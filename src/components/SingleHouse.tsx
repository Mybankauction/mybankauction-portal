import { formatRupee, readableDate } from '@/utils'
import { Image } from '@/utils/images'
// 1. Import useLocation from react-router-dom
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { MdDelete } from 'react-icons/md'

// (Your PropertyData and PropertyImage functions remain the same)
export interface PropertyData {
  _id: string
  'Account name': string
  'Auction Id': string
  'Bank Name': string
  EMD: string
  'Branch Name': string
  'Service Provider': string
  'Reserve Price': string | number
  'Contact Details': string
  Description: string
  State: string
  City: string
  Area: string
  'Borrower Name': string
  'Property Type': string
  'Auction Type': string
  'Sub End': string
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

// Define props for the component, including an optional onDelete function
interface SingleHouseProps {
  data: PropertyData
  onDelete?: (property_id: string) => void;
}

export default function SingleHouse({ data, onDelete }: SingleHouseProps) {
  // 2. Use the hook inside your component
  const location = useLocation()

  // 3. Perform the check inside the component render logic
  const shouldShowDeleteIcon = location.pathname === '/interested-properties'

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the parent Link from navigating
    e.preventDefault()
    e.stopPropagation()

    // Call the onDelete function passed from the parent, if it exists
    if (onDelete) {
      onDelete(data._id)
    }
  }

  return (
    <Link
      key={data['Auction Id']}
      to={`/properties/${data['Auction Id']}`}
      target='_blank'
      rel='noopener noreferrer'
      className='text-sm'
    >
      <div className='relative bg-white shadow rounded overflow-hidden cursor-pointer '>
        <img
          src={PropertyImage(data['Property Type'])}
          alt={data['Account name']}
          className='w-full h-52 object-cover'
        />
        {/* 4. Use the new variable for conditional rendering */}
        {shouldShowDeleteIcon && (
          <button
            onClick={handleDeleteClick}
            className='absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 p-1 rounded-full shadow z-10'
            aria-label="Delete property"
          >
            <MdDelete size={25} color='red' />
          </button>
        )}
        <div className='p-3'>{/* ... rest of your card details */}
         <div className='*:py-1 tracking-wide'>
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
               className='mt-1'
             >
               View More
             </Button>
           </p>
         </div>
       </div>
      </div>
    </Link>
  )
}