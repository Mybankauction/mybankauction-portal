import { BANGALORE_AREAS, PROPERTY_TYPES, STATES, CITIES } from '@/constants'
import { useApiStore } from '@/store/apiStore'
import { formatRupee, formattedDate, formattedEndOfDay } from '@/utils'
import { useEffect, useState } from 'react'
import DateComponent from '../Date'
import MultiSelect from '../MultiSelect'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

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
    const { filters, setFilters, loading } = useApiStore()

    const [auctionId, setAuctionId] = useState('')
    const [selectedState, setSelectedState] = useState<StateOption | null>(null)
    const [selectedCity, setSelectedCity] = useState<CityOption | null>(null)
    const [filteredCityOptions, setFilteredCityOptions] = useState<CityOption[]>([])
    const [selectedPropertyTypeOptions, setSelectedPropertyTypeOptions] = useState<PropertyTypeOption[]>([])
    const [auctionStartDate, setAuctionStartDate] = useState<string | null>('')
    const [auctionEndDate, setAuctionEndDate] = useState<string | null>('')
    const [minPrice, setMinPrice] = useState<string>('')
    const [maxPrice, setMaxPrice] = useState<string>('')
    const [selectedAreaOptions, setSelectedAreaOptions] = useState<AreaOption[]>([])
    const [filteredAreaOptions, setFilteredAreaOptions] = useState<AreaOption[]>([])

    // Debounced filter update
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setFilters({
                auctionId,
                state: selectedState?.value,
                city: selectedCity?.value,
                propertyType: selectedPropertyTypeOptions.map((option) => option.value),
                auctionStartDate: formattedDate(auctionStartDate!),
                auctionEndDate: formattedEndOfDay(auctionEndDate!),
                minPrice: minPrice ? minPrice.replace(/,/g, '') : '',
                maxPrice: maxPrice ? maxPrice.replace(/,/g, '') : '',
                area: selectedAreaOptions.map((option) => option.value),
            });
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [
        auctionId,
        selectedState,
        selectedCity,
        selectedPropertyTypeOptions,
        auctionStartDate,
        auctionEndDate,
        minPrice,
        maxPrice,
        selectedAreaOptions,
        setFilters
    ]);

    // Populate form from stored filters only on mount
    useEffect(() => {
        if (filters) {
            setSelectedAreaOptions(
                filters.area?.map((area) => ({ value: area, label: area })) || []
            )
            setSelectedPropertyTypeOptions(
                filters.propertyType?.map((type) => ({ value: type, label: type })) || []
            )
            setAuctionStartDate(filters.auctionStartDate || '')
            setAuctionEndDate(filters.auctionEndDate || '')
            setMinPrice(filters.minPrice?.toString() || '')
            setMaxPrice(filters.maxPrice?.toString() || '')
            setAuctionId(filters.auctionId?.toString() || '')
            if (filters.state) {
                const stateOption = STATES.find(s => s.value === filters.state)
                setSelectedState(stateOption || null)
            }
            if (filters.city) {
                const cityOption = CITIES.find(c => c.value === filters.city)
                setSelectedCity(cityOption || null)
            }
        }
    }, [])

    const handleClearFilters = () => {
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
    }

    const handleStateSelectChange = (selected: StateOption | null) => {
        setSelectedState(selected);
        setSelectedCity(null);
        setFilteredCityOptions([]);
        setSelectedAreaOptions([]);
    }

    const handleCitySelectChange = (selected: CityOption | null) => {
        setSelectedCity(selected);
        setSelectedAreaOptions([]);
    }

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

    const handlePropertyTypeSelectChange = (selected: PropertyTypeOption[]) => {
        setSelectedPropertyTypeOptions(selected)
    }

    const handlePriceChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPrice: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const rawValue = e.target.value.replace(/,/g, '')
        if (!isNaN(Number(rawValue))) {
            setPrice(formatRupee(rawValue))
        }
    }

    const handleAreaSelectChange = (selected: AreaOption[]) => {
        setSelectedAreaOptions(selected)
    }

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

    return (
        <section className='lg:p-4 lg:bg-white lg:rounded-lg lg:shadow-sm'>
            <div className='flex flex-col lg:flex-row lg:flex-wrap lg:items-end gap-3'>
                <div className="flex-grow min-w-[150px]">
                    <Input
                        type='number'
                        placeholder='Search ID'
                        value={auctionId}
                        onChange={(e) => setAuctionId(e.target.value)}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <MultiSelect
                        options={STATES}
                        placeholder='Select State'
                        onChange={(selected: StateOption[]) => handleStateSelectChange(selected[0] || null)}
                        value={selectedState ? [selectedState] : []}
                        singleSelect={true}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <MultiSelect
                        options={filteredCityOptions}
                        placeholder={selectedState ? 'Search City' : 'Select State first'}
                        onInputChange={handleCityInputChange}
                        onChange={(selected: CityOption[]) => handleCitySelectChange(selected[0] || null)}
                        value={selectedCity ? [selectedCity] : []}
                        singleSelect={true}
                        disabled={!selectedState}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <MultiSelect
                        options={PROPERTY_TYPES}
                        placeholder='Property Type'
                        onChange={handlePropertyTypeSelectChange}
                        value={selectedPropertyTypeOptions}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <DateComponent
                        placeholder='Start Date'
                        date={auctionStartDate}
                        setDate={setAuctionStartDate}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <DateComponent
                        placeholder='End Date'
                        date={auctionEndDate}
                        setDate={setAuctionEndDate}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <Input
                        type='text'
                        placeholder='Min price'
                        value={formatRupee(minPrice)}
                        onChange={(e) => handlePriceChange(e, setMinPrice)}
                    />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <Input
                        type='text'
                        placeholder='Max price'
                        value={formatRupee(maxPrice)}
                        onChange={(e) => handlePriceChange(e, setMaxPrice)}
                    />
                </div>
                <Button
                    type="button"
                    className='text-white'
                    onClick={handleClearFilters}
                >
                    Clear Filter
                </Button>
            </div>
        </section>
    )
}