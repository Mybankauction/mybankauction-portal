import { BANGALORE_AREAS, PROPERTY_TYPES } from '@/constants'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { formattedDate } from '@/utils'
import { useState } from 'react'
import Date from './Date'
import MultiSelect from './MultiSelect'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function Filters() {
  const [filteredAreaOptions, setFilteredAreaOptions] = useState([])
  const [filteredPropertyTypeOptions, setFilteredPropertyTypeOptions] =
    useState([])
  const [auctionStartDate, setAuctionStartDate] = useState(null)
  const [auctionEndDate, setAuctionEndDate] = useState(null)
  const { filters, setFilters, fetchData, loading } = useApiStore()
  const [selectedAreaOptions, setSelectedAreaOptions] = useState([])
  const [selectedPropertyTypeOptions, setSelectedPropertyTypeOptions] =
    useState([])
  const accessToken = useAccessToken()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formFilters = Object.fromEntries(formData.entries())
    // console.log(formFilters)
    // @ts-ignore
    setFilters({
      ...formFilters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedDate(auctionEndDate!),
      area: selectedAreaOptions.map((option: any) => option.value),
      propertyType: selectedPropertyTypeOptions.map(
        (option: any) => option.value
      ),
    })
    if (accessToken) fetchData(accessToken, 1)
  }

  // Area type
  const handleAreaSelectChange = (selected: any) => {
    setSelectedAreaOptions(selected)
    // console.log(selected)
  }

  // Area search field
  const handleAreaInputChange = (input: any) => {
    if (input.length >= 2) {
      setFilteredAreaOptions(
        // @ts-ignore
        BANGALORE_AREAS.filter((option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        )
      )
    } else {
      setFilteredAreaOptions([])
    }
  }

  // Property type
  const handlePropertyTypeSelectChange = (selected: any) => {
    setSelectedPropertyTypeOptions(selected)
    // console.log(selected)
  }

  return (
    <section className=' flex-wrap gap- py-3 px-6 shadow border-gray-300 rounded  max-w-[380px] bg-white'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-[340px]'>
        {/* Area Input */}
        <MultiSelect
          options={filteredAreaOptions}
          placeholder='Type at least 2 characters...'
          onInputChange={handleAreaInputChange}
          onChange={handleAreaSelectChange}
          value={selectedAreaOptions}
          name='area'
          label='Area'
          id='area'
        />

        <hr className='border-gray-200 max-w-full  my-2' />

        {/* Property Type */}
        <MultiSelect
          // options={filteredPropertyTypeOptions}
          options={PROPERTY_TYPES}
          placeholder='Nothing selected'
          // onInputChange={handlePropertyTypeInputChange}
          onChange={handlePropertyTypeSelectChange}
          value={selectedPropertyTypeOptions}
          name='propertyType'
          label='Property type'
          id='propertyType'
        />
        <hr className='border-gray-200 max-w-full my-2' />
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
        <hr className='border-gray-200 max-w-full  my-2' />
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
            className=''
          />
        </div>
        {filters.auctionEndDate ||
        filters.area ||
        filters.auctionStartDate ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.propertyType ? (
          // selectedAreaOptions.length > 0
          <Button
            variant='link'
            className='inline max-w-fit px-0 text-red-400'
            onClick={() => {
              setAuctionStartDate(null)
              setAuctionEndDate(null)
              setSelectedPropertyTypeOptions([])
              setSelectedAreaOptions([])
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
