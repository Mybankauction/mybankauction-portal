import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { formattedDate } from '@/utils'
import { useState } from 'react'
import Date from './Date'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function Filters() {
  const [auctionStartDate, setAuctionStartDate] = useState(null)
  const [auctionEndDate, setAuctionEndDate] = useState(null)
  const { setFilters, fetchData } = useApiStore()
  const accessToken = useAccessToken()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const filters = Object.fromEntries(formData.entries())

    setFilters({
      ...filters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedDate(auctionEndDate!),
    })

    if (accessToken) fetchData(accessToken, 1)
  }

  return (
    <section className='flex flex-wrap gap-4'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Area Input */}
        {/* <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='area'>Area</Label>
          <Input
            id='area'
            type='text'
            name='area'
            placeholder='e.g., HSR Layout, BTM Layout'
          />
        </div> */}
        {/* Date Inputs */}
        <div>
          <Date
            placeholder='Auction Start Date'
            date={auctionStartDate}
            setDate={setAuctionStartDate}
            name='auctionStartDate'
          />
        </div>
        <div>
          <Date
            placeholder='Auction End Date'
            date={auctionEndDate}
            setDate={setAuctionEndDate}
            name='auctionEndDate'
          />
        </div>
        {/* Min Price */}
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='minPrice'>Min Price</Label>
          <Input
            type='number'
            id='minPrice'
            name='minPrice'
            placeholder='Min price'
          />
        </div>
        {/* Max Price */}
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='maxPrice'>Max Price</Label>
          <Input
            type='number'
            id='maxPrice'
            name='maxPrice'
            placeholder='Max price'
          />
        </div>
        {/* Submit Button */}
        <button
          type='submit'
          className='mt-4 rounded bg-red-400 px-4 py-2 text-white'
        >
          Search
        </button>
      </form>
    </section>
  )
}
