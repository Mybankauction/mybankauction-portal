// src/hooks/useInterest.ts

import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from './useAuth';

// --- Import your new API functions ---
import { addInterestedProperty, deleteInterestedProperty } from '@/utils/api';

export function useInterest() {
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useAuth(); // Check if the user is logged in

  const addInterest = async (propertyId: string) => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to do that.');
      throw new Error('User not logged in');
    }

    setIsLoading(true);
    try {
      // Use the imported API function
      await addInterestedProperty(propertyId);
      toast.success('Added to your interested list!');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Could not add property.');
      throw error; // Re-throw to allow the component to revert its state
    } finally {
      setIsLoading(false);
    }
  };

  const removeInterest = async (propertyId: string) => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to do that.');
      throw new Error('User not logged in');
    }
    
    setIsLoading(true);
    try {
      // Use the imported API function
      await deleteInterestedProperty(propertyId);
      toast.success('Removed from your interested list.');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Could not remove property.');
      throw error; // Re-throw to allow the component to revert its state
    } finally {
      setIsLoading(false);
    }
  };

  return { addInterest, removeInterest, isLoading };
}