import Select from 'react-select'
import { Label } from './ui/label'

export default function MultiSelect({
  label,
  name,
  options,
  placeholder,
  onInputChange,
  onChange,
  value,
  id,
}: any) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select
        isMulti
        options={options}
        placeholder={placeholder}
        onInputChange={onInputChange}
        onChange={onChange}
        isClearable
        name={name}
        value={value}
        id={id}
        className='border-neutral-400 mt-1'
      />
    </div>
  )
}
