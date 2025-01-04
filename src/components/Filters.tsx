import { BANGALORE_AREAS, PROPERTY_TYPES } from '@/constants'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { formattedDate } from '@/utils'
import { Image } from '@/utils/images'
import { useState } from 'react'
import Select from 'react-select'
import Date from './Date'
import MySelect from './MySelect'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function Filters() {
  const [filteredOptions, setFilteredOptions] = useState([])
  const [auctionStartDate, setAuctionStartDate] = useState(null)
  const [auctionEndDate, setAuctionEndDate] = useState(null)
  const [propertyType, setPropertyType] = useState<string | null>(null)
  const { filters, setFilters, fetchData, loading } = useApiStore()
  const [selectedOptions, setSelectedOptions] = useState([])
  const accessToken = useAccessToken()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formFilters = Object.fromEntries(formData.entries())

    // @ts-ignore
    setFilters({
      ...formFilters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedDate(auctionEndDate!),
      area: selectedOptions.map((option: any) => option.value),
    })
    if (accessToken) fetchData(accessToken, 1)
  }

  // Area type
  const handleAreaSelectChange = (selected: any) => {
    setSelectedOptions(selected ? selected : null)
    // @ts-ignore
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   propertyType: selected?.value || '',
    // }))
  }

  // Area search field
  const handleAreaInputChange = (input: any) => {
    if (input.length >= 2) {
      setFilteredOptions(
        // @ts-ignore
        BANGALORE_AREAS.filter((option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        )
      )
    } else {
      setFilteredOptions([])
    }
  }

  const handlePropertyTypeChange = (value: any) => {
    setPropertyType(value) // Update state directly with the received value
  }

  const clearPropertyType = () => {
    setPropertyType('')
    // @ts-ignore
    setFilters((prevFilters) => ({ ...prevFilters, propertyType: '' }))
    // if (accessToken) fetchData(accessToken, 1)
  }

  return (
    <section className='flex flex-wrap gap-4 py-8 px-6 shadow border-gray-300 rounded  max-w-[380px] bg-white'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[340px]'>
        {/* Area Input */}
        <div>
          <Label htmlFor='area'>Area</Label>
          <Select
            options={filteredOptions}
            isMulti
            placeholder='Type at least 2 characters...'
            onInputChange={handleAreaInputChange}
            onChange={handleAreaSelectChange}
            isClearable
            name='area'
            value={selectedOptions}
            id='area'
            className='border-neutral-400 mt-2'
          />
        </div>
        <hr className='border-gray-200 max-w-full my-1' />

        {/* Property Type */}
        <div className='flex  items-center'>
          <div className='flex-grow'>
            <MySelect
              options={PROPERTY_TYPES}
              value={propertyType}
              onChange={handlePropertyTypeChange}
              name='propertyType'
            />
          </div>
          {propertyType && (
            <Button
              variant='link'
              size='icon'
              onClick={clearPropertyType}
              className='ml-2 mt-5'
            >
              <img src={Image.Cross} alt='Clear Property Type' />
              {/* Add alt text */}
            </Button>
          )}
        </div>
        <hr className='border-gray-200 max-w-full my-1' />
        {/* Date Inputs */}
        <div>
          <Date
            placeholder='Select date'
            date={auctionStartDate}
            setDate={setAuctionStartDate}
            name='auctionStartDate'
            label='Auction Start Date'
          />
        </div>
        <div>
          <Date
            placeholder='Select date'
            date={auctionEndDate}
            setDate={setAuctionEndDate}
            name='auctionEndDate'
            label='Auction End Date'
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
        filters?.area?.length! > 0 ||
        filters.auctionStartDate ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.propertyType ||
        selectedOptions.length > 0 ? (
          <Button
            variant='link'
            className='inline max-w-fit px-0 text-red-400'
            onClick={() => {
              setAuctionStartDate(null)
              setAuctionEndDate(null)
              setPropertyType('')
              setSelectedOptions([])
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
        </button>
      </form>
    </section>
  )
}
