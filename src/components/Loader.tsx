import { Skeleton } from './ui/skeleton'

export default function Loader() {
  return (
    <>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[225px] min-w-[310px] rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
          <Skeleton className='h-4 w-[100px]' />
        </div>
      </div>
    </>
  )
}
