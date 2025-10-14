import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { MapPin, Heart, Phone } from 'lucide-react';

import useAuth from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import { Button } from './ui/button';
import { formatRupee, readableDate } from '@/utils';
import { Image as ImageUtils } from '@/utils/images';
import { postInterestedProperty, deleteInterestedProperty } from '@/utils/api';
import toast from 'react-hot-toast';


const STORAGE_KEY = 'interestedAuctionIds';

// Reads the list of IDs from localStorage
const getInterestedIdsFromStorage = (): string[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

// Adds an ID to the list in localStorage
const addInterestedIdToStorage = (id: string) => {
  const ids = getInterestedIdsFromStorage();
  if (!ids.includes(id)) {
    ids.push(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
};

// Removes an ID from the list in localStorage
const removeInterestedIdFromStorage = (id: string) => {
  let ids = getInterestedIdsFromStorage();
  ids = ids.filter(currentId => currentId !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

// --- Component Interfaces ---

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
  const isLoggedIn = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  // Initialize state directly from localStorage for an instant UI
  const [isLiked, setIsLiked] = useState(() => {
    if (!isLoggedIn) return false;
    const interestedIds = getInterestedIdsFromStorage();
    return interestedIds.includes(data._id);
  });

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };

  const handleCardClick = () => {
    if (isLoggedIn) {
      navigate(`/properties/${data['Auction Id']}`);
    } else {
      setActiveTab('login');
      setAuthOpen(true);
    }
  };

  // Optimistic UI handler for liking/unliking
  const handleProtectedAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      setActiveTab('login');
      setAuthOpen(true);
      return;
    }

    const previousIsLiked = isLiked;
    const newIsLiked = !previousIsLiked;

    // Step 1: Optimistic Update (Instant)
    setIsLiked(newIsLiked);
    if (newIsLiked) {
      addInterestedIdToStorage(data._id);
    } else {
      removeInterestedIdFromStorage(data._id);
    }

    // Step 2: API Call (Background Sync)
    try {
      if (newIsLiked) {
        await postInterestedProperty({ property_id: data._id });
        toast.success('Marked as Interested!');
      } else {
        await deleteInterestedProperty({ property_id: data._id });
        toast.success('Removed from Interested');
        if (onDelete) {
          onDelete(data._id);
        }
      }
    } catch (error) {
      // Step 3: Revert on Failure
      toast.error('An error occurred. Please try again.');
      console.error('Like/Unlike error:', error);
      
      setIsLiked(previousIsLiked);
      if (previousIsLiked) {
        addInterestedIdToStorage(data._id);
      } else {
        removeInterestedIdFromStorage(data._id);
      }
    }
  };

  return (
    <>
      <div onClick={handleCardClick} className='block w-full text-left cursor-pointer'>
        <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
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
          <div className="flex flex-col justify-between p-4 w-full">
            <div>
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
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={handleProtectedAction}>
                  <Heart className={`h-6 w-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-5 border-t border-b border-gray-100 py-3 my-3">
                <div>
                  <p className="text-xs text-gray-400">Area</p>
                  <p className="text-sm font-medium text-gray-700">{data.Area || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Auction Date</p>
                  <p className="text-sm font-medium text-gray-700">{readableDate(data.auction_start_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Reserved Price</p>
                  <p className="text-sm font-medium text-gray-700">₹{formatRupee(data["Reserve Price"].toString())}</p>
                </div>
              </div>
              <p className={`text-xs text-gray-500 leading-relaxed line-clamp-2 blur-[2px] ${isLoggedIn ? 'blur-none' : ''}`}>
                {data.Description || 'No description available.'}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                  {data['Bank Name'] ? data['Bank Name'].charAt(0).toUpperCase() : 'B'}
                </span>
                <p className="text-sm font-semibold">{data['Bank Name'] || 'Bank Name'}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={handleProtectedAction}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-900" onClick={handleProtectedAction}>
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className='max-w-sm max-h-[90vh] overflow-y-auto'>
           <DialogHeader >
            <DialogTitle className='text-lg font-bold'>
              {activeTab === 'login' ? 'Login to Continue' : 'Sign Up to Continue'}
            </DialogTitle>
          </DialogHeader>
          <div className='flex gap-2 mb-4'>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded border ${activeTab === 'login' ? 'bg-[#E34732] text-white border-[#E34732]' : 'bg-white text-neutral-800'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-4 py-2 rounded border ${activeTab === 'signup' ? 'bg-[#E34732] text-white border-[#E34732]' : 'bg-white text-neutral-800'}`}
            >
              Sign Up
            </button>
          </div>
          <div>
            {activeTab === 'login' ? (
              <LoginForm onSuccess={() => setAuthOpen(false)} />
            ) : (
              <SignupForm onSuccess={() => setAuthOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}