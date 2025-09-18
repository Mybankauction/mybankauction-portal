// import Filters from '@/components/features/Filters'
// import PaginatedList from '@/components/PaginationList'

// export default function Home() {
//   return (
//     <>
//       {/* max-w-[110rem] */}
//       <div className='mx-auto flex flex-col gap-1 gap-y-5 items-center lg:items-start justify-center lg:flex-row'>
//         <Filters />
//         <PaginatedList />
//       </div>
//     </>
//   )
// }

import Filters from '@/components/features/Filters'
import Header from '@/components/Header'
import PaginatedList from '@/components/PaginationList'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter as FilterIcon } from 'lucide-react'

import { useState } from 'react'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {/* Main Layout */}
      <Header />

      <div className='mx-auto flex mt-2 flex-col gap-1 gap-y-5 items-center lg:items-start justify-center lg:flex-row'>
        {/* Filters for Large Screens */}
        <div className='hidden lg:block'>
          <Filters />
        </div>

        {/* Filters in Dialog for Mobile/Tablet */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className='lg:hidden' asChild>
            <Button
              type='button'
              className='fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 shadow-lg lg:hidden'
              variant={'default'}
            >
              <FilterIcon className='h-6 w-6' />
            </Button>
          </DialogTrigger>
          <DialogContent className='w-full h-[90vh] max-w-none lg:max-w-fit flex flex-col overflow-y-auto lg:h-auto'>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <Filters setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
        <PaginatedList />
      </div>
    </>
  )
}