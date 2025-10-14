import Header from '@/components/Header';
import { triggerAuthUpdate } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// A simple pencil icon component for the edit button
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);


export default function Account() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // --- FIXED LOGOUT HANDLER ---
  const handleLogout = () => {
    // 1. Clear all user data from storage first.
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('apiStore');
    localStorage.removeItem('interestedAuctionIds');

    // 2. Trigger any global auth state updates.
    triggerAuthUpdate();

    // 3. Navigate away. This unmounts the current component,
    //    preventing it from re-rendering with null data.
    navigate('/');
    
    // window.location.reload() is often not needed in React apps,
    // as navigation and state management should handle the UI updates.
  };

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const _user = JSON.parse(userString);
        setUserData(_user);
      } else {
        // If no user, redirect to login/home immediately.
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      // If data is corrupt, clear it and redirect.
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [navigate]);

  // Render a loading state or nothing while user data is being set.
  if (!userData) {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        </>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* --- Card Header --- */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://robohash.org/mail@ashallendesign.co.uk" // Placeholder image
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover bg-primary"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData.Name1}</h1>
                <p className="text-gray-500">{userData.email}</p>
              </div>
            </div>
            
          </div>

          {/* --- User Details --- */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{userData.Name1 || 'Not set'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Email account</p>
              <p className="font-medium text-gray-800">{userData.email || 'Not set'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Mobile number</p>
              <p className="font-medium text-gray-800">{userData.phone_number || 'Add number'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-800">{userData.location || 'INDIA'}</p>
            </div>
          </div>
          
          {/* --- Action Buttons --- */}
          <div className='flex items-center gap-4 pt-4'>
             
            <button
              className='w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}