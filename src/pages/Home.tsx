// home.tsx

import Filters from "@/components/features/Filters";
import Header from "@/components/Header";
import PaginatedList from "@/components/PaginationList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter as FilterIcon } from "lucide-react";

import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Header />
      <div className='mx-auto max-w-7xl px-4 py-4'>
        {/* ... Filters for Large Screens ... */}
        <div className='hidden lg:block sticky top-20 z-10'>
          <Filters />
        </div>

        {/* Filters in Dialog for Mobile/Tablet */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {/* This parent component correctly handles showing/hiding the trigger */}
          <DialogTrigger className="lg:hidden" asChild>
            <Button
              type="button"
              // REMOVED `lg:hidden` from this line
              className="fixed bottom-6 right-6 bg-primary z-50 rounded-full h-14 w-14 p-0 shadow-lg"
              variant="default"
            >
              <FilterIcon className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto" >
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <Filters setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>

        {/* ... PaginatedList ... */}
        <div className='mt-5'>
          <PaginatedList />
        </div>
      </div>
    </>
  )
}
