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
import PaginatedList from '@/components/PaginationList'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { useState } from 'react'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {/* Main Layout */}
      <div className='mx-auto flex flex-col gap-1 gap-y-5 items-center lg:items-start justify-center lg:flex-row'>
        {/* Filters for Large Screens */}
        <div className=''>
          <Filters />
        </div>

        {/* Filters in Modal for Small Screens */}
        {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className='lg:hidden px-4 py-2 rounded'>
            <Button variant={'outline'} className='max-w-16 min-w-52'>
              Search
            </Button>
          </DialogTrigger>
          <DialogContent className='w-fit h-full max-w-none lg:max-w-fit flex flex-col overflow-y-scroll pb-11 flex-1 lg:h-auto'>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <Filters setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog> */}
        <PaginatedList />
      </div>
    </>
  )
}
