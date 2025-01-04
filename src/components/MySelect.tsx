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
  const [selectedValue, setSelectedValue] = useState(value)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  return (
    <div>
      <Label htmlFor='propertyType'>Property Type</Label>
      <ShadcnSelect
        name={name}
        value={selectedValue ?? ''}
        onValueChange={onChange}
      >
        <SelectTrigger id='propertyType'>
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
    </div>
  )
}
