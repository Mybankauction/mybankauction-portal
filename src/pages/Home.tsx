import Filters from '@/components/Filters'
import PaginatedList from '@/components/PaginationList'

export default function Home() {
  return (
    <>
      {/* max-w-[110rem] */}
      <div className='mx-auto flex flex-col gap-1 gap-y-5 items-center lg:items-start justify-center lg:flex-row'>
        <Filters />
        <PaginatedList />
      </div>
    </>
  )
}
