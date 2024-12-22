import Filters from '@/components/Filters'
import PaginatedList from '@/components/PaginationList'

export default function Home() {
  return (
    <>
      <div className='max-w-[80rem]  mx-auto px-4 flex flex-col gap-4 items-center lg:items-start justify-center lg:flex-row'>
        <Filters />
        <PaginatedList />
      </div>
    </>
  )
}
