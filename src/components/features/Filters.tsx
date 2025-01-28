import { BANGALORE_AREAS, PROPERTY_TYPES } from '@/constants'
import useAccessToken from '@/hooks/useAccessToken'
import { useApiStore } from '@/store/apiStore'
import { formattedDate } from '@/utils'
import { useEffect, useState } from 'react'
import DateComponent from '../Date'
import MultiSelect from '../MultiSelect'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type AreaOption = {
  value: string
  label: string
}

type PropertyTypeOption = {
  value: string
  label: string
}

export default function Filters() {
  const [filteredAreaOptions, setFilteredAreaOptions] = useState<AreaOption[]>(
    []
  )
  const [auctionStartDate, setAuctionStartDate] = useState<string | null>('')
  const [auctionEndDate, setAuctionEndDate] = useState<string | null>('')
  const { filters, setFilters, fetchData, loading } = useApiStore()
  const [selectedAreaOptions, setSelectedAreaOptions] = useState<AreaOption[]>(
    []
  )
  const [selectedPropertyTypeOptions, setSelectedPropertyTypeOptions] =
    useState<PropertyTypeOption[]>([])
  const accessToken = useAccessToken()
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  // Submit Form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // @ts-ignore
    const formFilters = Object.fromEntries(formData.entries()) as Filters

    setFilters({
      ...formFilters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedDate(auctionEndDate!),
      area: selectedAreaOptions.map((option) => option.value),
      propertyType: selectedPropertyTypeOptions.map((option) => option.value),
      minPrice: formFilters.minPrice
        ? parseInt(formFilters.minPrice as string)
        : null,
      maxPrice: formFilters.maxPrice
        ? parseInt(formFilters.maxPrice as string)
        : null,
    })
    if (accessToken) fetchData(accessToken, 1)
  }
  // console.log({ auctionEndDate }, { auctionStartDate })
  const handleClearFilters = async () => {
    setAuctionStartDate('')
    setAuctionEndDate('')
    setSelectedPropertyTypeOptions([])
    setSelectedAreaOptions([])
    setMinPrice('')
    setMaxPrice('')
    setFilters({})
    localStorage.removeItem('apiStore')
    if (accessToken) fetchData(accessToken, 1)
  }

  // Area type
  const handleAreaSelectChange = (selected: AreaOption[]) => {
    setSelectedAreaOptions(selected)
  }

  // Area search field
  const handleAreaInputChange = (input: string) => {
    if (input.length >= 2) {
      setFilteredAreaOptions(
        BANGALORE_AREAS.filter((option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        )
      )
    } else {
      setFilteredAreaOptions([])
    }
  }
  console.log({ filters })
  useEffect(() => {
    if (filters) {
      setSelectedAreaOptions(
        filters.area?.map((area) => ({
          value: area,
          label: area,
        })) || []
      )
      setSelectedPropertyTypeOptions(
        filters.propertyType?.map((type) => ({
          value: type,
          label: type,
        })) || []
      )
      setAuctionStartDate(filters.auctionStartDate || '')
      setAuctionEndDate(filters.auctionEndDate || '')
      setMinPrice(filters.minPrice?.toString() || '')
      setMaxPrice(filters.maxPrice?.toString() || '')
    }
  }, [filters])

  // Property type
  const handlePropertyTypeSelectChange = (selected: PropertyTypeOption[]) => {
    setSelectedPropertyTypeOptions(selected)
  }

  return (
    <section className=' flex-wrap gap- py-3 px-6 shadow border-gray-300 rounded  max-w-[380px] bg-white'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-[340px]'>
        {/* Area Input */}
        <MultiSelect
          options={filteredAreaOptions}
          placeholder='Ex: HSR, Sarjapura'
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
          options={PROPERTY_TYPES}
          placeholder='Ex: Land, Flat'
          onChange={handlePropertyTypeSelectChange}
          value={selectedPropertyTypeOptions}
          name='propertyType'
          label='Property type'
          id='propertyType'
        />
        <hr className='border-gray-200 max-w-full my-2' />
        {/* Date Inputs */}
        <div>
          <DateComponent
            placeholder='Select date'
            date={auctionStartDate}
            setDate={setAuctionStartDate}
            name='auctionStartDate'
            label='Auction Start Date'
          />
        </div>
        <div>
          <DateComponent
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
            value={minPrice} // Add this line
            onChange={(e) => setMinPrice(e.target.value)}
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
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
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
            onClick={handleClearFilters}
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
