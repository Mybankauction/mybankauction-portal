import { useEffect, useState } from 'react'
import PropertyIcon from './PropertyIcon'
import { Label } from './ui/label'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from './ui/select'

export default function MySelect({ options, value, onChange, name }: any) {
  const [selectedValue, setSelectedValue] = useState(value || '')

  useEffect(() => {
    setSelectedValue(value || '')
  }, [value])

  // console.log({ value })

  return (
    <div>
      <Label htmlFor={name}>Property Type</Label>
      <ShadcnSelect
        value={selectedValue ?? ''}
        onValueChange={(newValue) => {
          setSelectedValue(newValue) // Update local state
          onChange(newValue) // Propagate change
        }}
      >
        <SelectTrigger id={name} className='mt-2'>
          <SelectValue placeholder='Select property' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item: any) => (
              <SelectItem key={item.value} value={item.value}>
                <div className='flex items-center gap-2'>
                  <p>{PropertyIcon(item.value, 20)}</p>
                  <p>{item.label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </ShadcnSelect>

      {/* Hidden input to allow FormData to capture this field */}
      <input type='hidden' name={name} value={selectedValue} />
    </div>
  )
}
