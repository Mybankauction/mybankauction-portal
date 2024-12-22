import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function Date({ placeholder, date, setDate, name }: any) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 pb-4 pr-2'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className='flex'>
          <button
            className='mr-2-auto ml-4 block items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-colors  h-9 w-16 p-0 font-normal aria-selected:opacity-100 bg-neutral-900 text-neutral-50'
            onClick={() => setDate(null)}
          >
            Clear
          </button>
          <button
            className='ml-auto mr-4 block items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-colors  h-9 w-16 p-0 font-normal aria-selected:opacity-100 bg-neutral-900 text-neutral-50'
            onClick={() => setOpen(false)}
          >
            OK
          </button>
        </div>
      </PopoverContent>

      {/* Hidden input for form submission */}
      <input type='hidden' name={name} value={date ? date.toISOString() : ''} />
    </Popover>
  )
}
