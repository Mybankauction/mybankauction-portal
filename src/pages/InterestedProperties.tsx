import Header from '@/components/Header'
import SingleHouse, { PropertyData } from '@/components/SingleHouse'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/conf'
import { formatRupee } from '@/utils'
import { getAuthToken } from '@/utils/api'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'

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
      <div className='container w-full mt-5 pb-20'>
        <div className='mx-2 sm:mx-2 md:mx-3'>
          <Link to={'/properties'}>
            <Button variant={'link'} className='text-red-400'>
              <ArrowLeft />
              Go back
            </Button>
          </Link>
        </div>

        <h1 className='text-2xl font-bold mb-4 text-center'>My Interested Properties</h1>
        {loading ? (
          <p className='text-center'>Loading...</p>
        ) : items.length === 0 ? (
          <p className='text-center'>No interested properties yet.</p>
        ) : (
          <div className='mx-2 sm:mx-2 md:mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {items.map((item) => (
              <SingleHouse key={item["Auction Id"]} data={item} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}


