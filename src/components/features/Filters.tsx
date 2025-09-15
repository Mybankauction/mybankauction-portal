import { BANGALORE_AREAS, PROPERTY_TYPES, STATES, CITIES } from '@/constants'
import { useApiStore } from '@/store/apiStore'
import { formatRupee, formattedDate, formattedEndOfDay } from '@/utils'
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

type StateOption = {
  value: string
  label: string
}

type CityOption = {
  value: string
  label: string
  state: string
}

export default function Filters({ setIsOpen }: any) {
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
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [auctionId, setAuctionId] = useState('')
  const [selectedState, setSelectedState] = useState<StateOption | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null)
  const [filteredCityOptions, setFilteredCityOptions] = useState<CityOption[]>([])

  // Submit Form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // @ts-ignore
    const formFilters = Object.fromEntries(formData.entries()) as Filters

    setFilters({
      ...formFilters,
      auctionStartDate: formattedDate(auctionStartDate!),
      auctionEndDate: formattedEndOfDay(auctionEndDate!),
      area: selectedAreaOptions.map((option) => option.value),
      propertyType: selectedPropertyTypeOptions.map((option) => option.value),
      state: selectedState?.value,
      city: selectedCity?.value,
      minPrice: minPrice ? minPrice.replace(/,/g, '') : '',
      maxPrice: maxPrice ? maxPrice.replace(/,/g, '') : '',
    })
  }

  console.log({ formattedAuctionStartDate: formattedDate(auctionStartDate!) }, { formattedAuctionEndDate: formattedEndOfDay(auctionEndDate!) })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  // console.log({ auctionEndDate }, { auctionStartDate })
  const handleClearFilters = async () => {
    setAuctionStartDate('')
    setAuctionEndDate('')
    setSelectedPropertyTypeOptions([])
    setSelectedAreaOptions([])
    setMinPrice('')
    setMaxPrice('')
    setAuctionId('')
    setSelectedState(null)
    setSelectedCity(null)
    setFilteredCityOptions([])
    setFilters({})
    localStorage.removeItem('apiStore')
  }

  // Area type
  const handleAreaSelectChange = (selected: AreaOption[]) => {
    setSelectedAreaOptions(selected)
  }

  // Area search field - only show areas for Karnataka + Bangalore
  const handleAreaInputChange = (input: string) => {
    if (
      selectedState?.value === 'Karnataka' &&
      selectedCity?.value === 'Bengaluru' &&
      input.length >= 2
    ) {
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
      setAuctionId(filters.auctionId?.toString() || '')
      
      // Set state and city from filters
      if (filters.state) {
        const stateOption = STATES.find(s => s.value === filters.state)
        setSelectedState(stateOption || null)
      }
      if (filters.city) {
        const cityOption = CITIES.find(c => c.value === filters.city)
        setSelectedCity(cityOption || null)
      }
    }
  }, [filters])

  // Property type
  const handlePropertyTypeSelectChange = (selected: PropertyTypeOption[]) => {
    setSelectedPropertyTypeOptions(selected)
  }

  // State selection
  const handleStateSelectChange = (selected: StateOption | null) => {
    setSelectedState(selected)
    setSelectedCity(null) // Reset city when state changes
    setFilteredCityOptions([]) // Clear city options
    setSelectedAreaOptions([]) // Reset area when state changes
  }

  // City selection
  const handleCitySelectChange = (selected: CityOption | null) => {
    setSelectedCity(selected)
    setSelectedAreaOptions([]) // Reset area when city changes
  }

  // City input change - filter cities based on selected state
  const handleCityInputChange = (input: string) => {
    if (selectedState && input.length >= 2) {
      const filteredCities = CITIES.filter(
        (city) =>
          city.state === selectedState.value &&
          city.label.toLowerCase().includes(input.toLowerCase())
      )
      setFilteredCityOptions(filteredCities)
    } else {
      setFilteredCityOptions([])
    }
  }

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPrice: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const rawValue = e.target.value.replace(/,/g, '') // Remove commas
    if (!isNaN(Number(rawValue))) {
      setPrice(formatRupee(rawValue)) // Format value with commas
    }
  }

  // const anyFiltersApplied = Boolean(
  //   filters.auctionStartDate ||
  //     filters.auctionEndDate ||
  //     filters?.area?.length > 0 ||
  //     filters.minPrice ||
  //     filters.maxPrice ||
  //     filters.auctionId ||
  //     filters?.propertyType?.length > 0
  // )

  return (
    <section className=' flex-wrap gap- py-3 px-6 shadow border-gray-300 rounded  bg-white min-w-[320px] max-w-[380px] '>
      <form
        onSubmit={handleSubmit}
        // w-[340px]
        className='flex flex-col gap-2 '
        onKeyDown={handleKeyDown}
      >
        {/* Auction ID */}
        <div>
          <Label htmlFor='auctionId'>Auction Id</Label>
          <Input
            type='number'
            id='auctionId'
            name='auctionId'
            placeholder='Ex: 453608'
            className='mt-1'
            value={auctionId}
            onChange={(e) => setAuctionId(e.target.value)}
          />
        </div>

        <hr className='border-gray-200 max-w-full  my-2' />

        {/* State Selection */}
        <div>
          <MultiSelect
            options={STATES}
            placeholder='Select State'
            onChange={(selected: StateOption[]) => handleStateSelectChange(selected[0] || null)}
            value={selectedState ? [selectedState] : []}
            name='state'
            label='State'
            id='state'
            singleSelect={true}
          />
        </div>


        {/* City Selection */}
        <div>
          <MultiSelect
            options={filteredCityOptions}
            placeholder={selectedState ? 'Search City' : 'Select State first'}
            onInputChange={handleCityInputChange}
            onChange={(selected: CityOption[]) => handleCitySelectChange(selected[0] || null)}
            value={selectedCity ? [selectedCity] : []}
            name='city'
            label='City'
            id='city'
            singleSelect={true}
            disabled={!selectedState}
          />
        </div>


        {/* Area Input */}
        {selectedCity?.value === 'Bengaluru' && <MultiSelect
          options={filteredAreaOptions}
          placeholder={
            selectedState?.value === 'Karnataka' && selectedCity?.value === 'Bengaluru'
              ? 'Ex: HSR, Sarjapura'
              : selectedState && selectedCity
              ? 'No areas available for this city'
              : 'Select State and City first'
          }
          onInputChange={handleAreaInputChange}
          onChange={handleAreaSelectChange}
          value={selectedAreaOptions}
          name='area'
          label='Area'
          id='area'
          disabled={
            !selectedState || 
            !selectedCity || 
            !(selectedState.value === 'Karnataka' && selectedCity.value === 'Bengaluru')
          }
        />}


        {/* Property Type */}
        <MultiSelect
          options={PROPERTY_TYPES}
          placeholder='Ex: Land, Flat'
          onChange={handlePropertyTypeSelectChange}
          value={selectedPropertyTypeOptions}
          name='propertyType'
          label='Property Type'
          id='propertyType'
        />
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
        <div className='flex items-center gap-3'>
          <div>
            <Label htmlFor='minPrice'>Min Price</Label>
            <Input
              type='text'
              id='minPrice'
              name='minPrice'
              placeholder='Min price'
              className=''
              value={formatRupee(minPrice)}
              onChange={(e) => handlePriceChange(e, setMinPrice)}
            />
          </div>
          {/* Max Price */}
          <div>
            <Label htmlFor='maxPrice'>Max Price</Label>
            <Input
              type='text'
              id='maxPrice'
              name='maxPrice'
              placeholder='Max price'
              className=''
              value={formatRupee(maxPrice)}
              onChange={(e) => handlePriceChange(e, setMaxPrice)}
            />
          </div>
        </div>
        {filters.auctionEndDate ||
        filters.area ||
        filters.auctionStartDate ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.propertyType ||
        filters.state ||
        filters.city ? (
          // selectedAreaOptions.length > 0
          <Button
            variant='link'
            className='inline max-w-fit px-0 text-red-400'
            onClick={() => {
              handleClearFilters()
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
          // onClick={() => {
          //   if (!loading && !anyFiltersApplied) {
          //     setIsOpen(false)
          //   }
          // }}
        >
          Search
        </button>
      </form>
    </section>
  )
}
