import { PROPERTY_TYPES } from '@/constants'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { formattedDate } from '@/utils'
import { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import Date from './Date'
import PropertyIcon from './PropertyIcon'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function Filters() {
  const [auctionStartDate, setAuctionStartDate] = useState(null)
  const [auctionEndDate, setAuctionEndDate] = useState(null)
  const [propertyType, setPropertyType] = useState<string | null>(null)
  const { filters, setFilters, fetchData, loading } = useApiStore()
  const accessToken = useAccessToken()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const filters = Object.fromEntries(formData.entries())
    if (Object.values(filters).every((value) => !value)) {
      return
    }
    console.log({ filters })
    setFilters({
      ...filters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedDate(auctionEndDate!),
    })

    if (accessToken) fetchData(accessToken, 1)
  }

  return (
    <section className='flex flex-wrap gap-4 py-8 px-6 shadow border-gray-300 rounded max-w-[380px] bg-white'>
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
        {/* Property Type */}
        <Label htmlFor='propertyType'>Property Type</Label>
        <Select
          name='propertyType'
          value={propertyType ?? undefined}
          onValueChange={(value) => setPropertyType(value || null)}
        >
          <SelectTrigger className='' id='propertyType'>
            <SelectValue placeholder='Select property' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectItem value='' disabled>
                Select property type
              </SelectItem> */}
              {PROPERTY_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className='flex items-center gap-2'>
                    <p>{PropertyIcon(item.value, 20)}</p>
                    <p>{item.label}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <hr className='border-gray-200 max-w-full my-1' />
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
        <hr className='border-gray-200 max-w-full my-1 mt-2' />
        {/* Min Price */}
        <div>
          <Label htmlFor='minPrice'>Min Price</Label>
          <Input
            type='number'
            id='minPrice'
            name='minPrice'
            placeholder='Min price'
            className='mt-1'
          />
        </div>
        {/* Max Price */}
        {/* grid w-full max-w-sm items-center gap-1.5 */}
        <div>
          <Label htmlFor='maxPrice'>Max Price</Label>
          <Input
            type='number'
            id='maxPrice'
            name='maxPrice'
            placeholder='Max price'
            className='mt-1'
          />
        </div>
        {filters.auctionEndDate ||
        filters.area ||
        filters.auctionStartDate ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.propertyType ? (
          <Button
            variant='link'
            className='inline max-w-fit px-0 text-red-400'
            onClick={() => {
              setAuctionStartDate(null)
              setAuctionEndDate(null)
              setPropertyType('')
              const form = document.querySelector('form')
              if (form) form.reset() // Reset form inputs
              setFilters({})
              if (accessToken) fetchData(accessToken, 1) // Fetch default data
            }}
          >
            Clear Filters
          </Button>
        ) : null}
        {/* Submit Button */}
        <button
          type='submit'
          className='rounded bg-red-400 px-4 py-2 text-white disabled:bg-red-600 disabled:cursor-not-allowed'
          disabled={loading}
        >
          Search
          {/* {loading ? (
            <div className='mx-auto flex'>
              <TailSpin
                visible={true}
                height='25'
                color='#fff'
                ariaLabel='tail-spin-loading'
                radius='1'
                wrapperStyle={{
                  margin: 'auto',
                  textAlign: 'center',
                }}
                wrapperClass=''
              />
            </div>
          ) : (
            <>Search</>
          )} */}
        </button>
      </form>
    </section>
  )
}
