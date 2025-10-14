import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function DateComponent({
  placeholder,
  date,
  setDate,
  name,
  label,
}: any) {
  const [open, setOpen] = useState(false)
  
  // The format function will handle null/undefined dates gracefully
  const formattedDate = date ? format(new Date(date), 'P') : null

  return (
    <>
      <Label htmlFor={label} className=''>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal mt-2',
              !date && 'text-muted-foreground'
            )}
            id={label}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {formattedDate ? formattedDate : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 pb-4 pr-2'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setOpen(false) // ✅ Close popover on date selection for better UX
            }}
            // ✅ This is the line that disables all dates before today
            disabled={{ before: new Date() }}
          />
          <div className='flex pt-2'>
            <button
              className='mr-2-auto ml-4 block items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-colors  h-9 w-16 p-0 font-normal aria-selected:opacity-100 bg-red-500 text-neutral-50'
              onClick={() => {
                setDate(null) // Use null for consistency
                setOpen(false)
              }}
            >
              Clear
            </button>
            <button
              className='ml-auto mr-4 block items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-colors  h-9 w-16 p-0 font-normal aria-selected:opacity-100 bg-red-500 text-neutral-50'
              onClick={() => setOpen(false)}
            >
              OK
            </button>
          </div>
        </PopoverContent>

        {/* Hidden input for form submission */}
        <input
          type='hidden'
          name={name}
          id={label}
          value={date ? new Date(date).toISOString() : ''}
        />
      </Popover>
    </>
  )
}