import Header from '@/components/Header'
import SingleHouse, { PropertyData } from '@/components/SingleHouse'
import { Button } from '@/components/ui/button'
import { API_BASE_URL, API_ENDPOINT } from '@/conf'
import { getAuthToken } from '@/utils/api'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

type InterestedProperty = PropertyData

export default function InterestedProperties() {
  const [items, setItems] = useState<InterestedProperty[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function fetchInterested() {
    try {
      setLoading(true)
      const token = getAuthToken()
      const res = await fetch(`${API_BASE_URL}/interested-properties`, {
        headers: token ? { Authorization: `${token}` } : undefined,
      })
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const json = await res.json()
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
      setItems(data)
    } catch (e) {
      console.error('Failed to fetch interested properties', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProperty = async (auctionId: string) => {
    console.log("Deleting property with Auction ID:", auctionId);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error('Authentication token not found.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/${API_ENDPOINT.DELETE_INTERESTED_PROPERTY}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,

        },
        body: JSON.stringify({ property_id: auctionId }),
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          return { message: `Request failed with status: ${response.status}` };
        });
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      setItems(prevItems => prevItems.filter(p => p._id !== auctionId));

      // Get the array from localStorage
      const storedData = localStorage.getItem('interestedAuctionIds');

      if (storedData) {
        let idArray = JSON.parse(storedData);

        // Remove the ID
        idArray = idArray.filter((id: string) => id !== auctionId);

        // Save the updated array back
        localStorage.setItem('interestedAuctionIds', JSON.stringify(idArray));
      }



    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property.');
    }
  }


  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/', { replace: true })
      return
    }
    fetchInterested()
  }, [])

  return (
    <>
      <Header />
      <div className='container max-w-7xl mt-5 pb-20'>
        <div className='mx-2 sm:mx-2 md:mx-3'>
          <Button
            variant="link"
            className="text-red-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1" />
            Go back
          </Button>
        </div>

        <h1 className='text-2xl font-bold mb-10 text-center'>Interested Properties</h1>
        {loading ? (
          <p className='text-center'>Loading...</p>
        ) : items.length === 0 ? (
          <p className='text-center'>No interested properties yet.</p>
        ) : (
          <div className='mx-2 flex flex-col gap-5 mb-8 relative'>
            {items.map((item) => (
              <SingleHouse
                key={item["Auction Id"]}
                data={item}
                onDelete={handleDeleteProperty} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}