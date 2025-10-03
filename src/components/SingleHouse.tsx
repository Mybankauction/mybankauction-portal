// SingleHouse.tsx

import { formatRupee, readableDate } from '@/utils';
import { Image as ImageUtils } from '@/utils/images';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { MdDelete } from 'react-icons/md';
import { MapPin, Heart, Phone } from 'lucide-react';

export interface PropertyData {
  _id: string;
  'Account name': string;
  'Auction Id': string;
  'Bank Name': string;
  EMD: string;
  'Branch Name': string;
  'Service Provider': string;
  'Reserve Price': string | number;
  'Contact Details': string;
  Description: string;
  State: string;
  City: string;
  Area: string;
  'Borrower Name': string;
  'Property Type': string;
  'Auction Type': string;
  'Sub End': string;
  sale_notice: string;
  AssetCategory?: string;
  outstanding_amount?: string;
  auction_start_date: string;
  auction_end_date: string;
}

function PropertyImage(type: string) {
  switch (type) {
    case 'Land':
      return ImageUtils.Land3;
    case 'Flat':
      return ImageUtils.Flat;
    case 'Land And Building':
      return ImageUtils.LandAndBuilding;
    case 'Plot':
      return ImageUtils.Plot;
    case 'House':
      return ImageUtils.House;
    case 'Villa':
      return ImageUtils.House;
    default:
      return 'https://placehold.co/250x200/F5F5F5/333333?text=Property';
  }
}

interface SingleHouseProps {
  data: PropertyData;
  onDelete?: (property_id: string) => void;
}

export default function SingleHouse({ data, onDelete }: SingleHouseProps) {
  const location = useLocation();
  const shouldShowDeleteIcon = location.pathname === '/interested-properties';

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };

  return (
    <Link
      to={`/properties/${data['Auction Id']}`}
      target='_blank'
      rel='noopener noreferrer'
      className='block w-full text-left'
    >
      <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
        
        {/* Left Side: Image */}
        <div className="relative flex-shrink-0 md:w-1/4">
          <img 
            src={PropertyImage(data['Property Type'])} 
            alt={data['Property Type'] || 'Property'} 
            className="h-48 w-full object-cover md:h-full"
          />
          {shouldShowDeleteIcon && (
            <button
              onClick={handleDeleteClick}
              className='absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 p-1 rounded-full shadow z-10'
              aria-label="Delete property"
            >
              <MdDelete size={25} color='red' />
            </button>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col justify-between p-4 w-full">
          <div>
            {/* Top Row: Location, Type & Favorite Icon */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-red-400" />
                  {data.City}, {data.State}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {data['Property Type'] || 'N/A'}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <Heart className="h-6 w-6" />
              </Button>
            </div>

            {/* Middle Row: Area, Deadline, Auction Date */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-3 my-3">
              <div>
                <p className="text-xs text-gray-400">Area</p>
                <p className="text-sm font-medium text-gray-700">{data.Area || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Auction Date</p>
                <p className="text-sm font-medium text-gray-700">{readableDate(data.auction_start_date)}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 blur-[2px]">
              {data.Description || 'No description available.'}
            </p>
          </div>

          {/* Bottom Row: Bank & Contact */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                {data['Bank Name'] ? data['Bank Name'].charAt(0).toUpperCase() : 'B'}
              </span>
              <p className="text-sm font-semibold">{data['Bank Name'] || 'Bank Name'}</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                 <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-900">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}