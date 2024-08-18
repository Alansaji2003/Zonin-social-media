import Image from 'next/image'
import Link from 'next/link'



type Props = {}

export default function Birthdays({}: Props) {
  return (
    <div className='hidden md:block p-4 bg-slate-800 text-white rounded-lg shadow-md text-sm flex flex-col gap-4'>
       
        {/* toppart */}
        <div className='flex justify-between items-center font-medium'>
            <span className='text-gray-400'>Birthdays (In development) </span>
            <Link href='/' className='text-red-500 text-xs'>See all</Link>
        </div>
        {/* userpart */}
        <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
        <Image src='https://images.pexels.com/photos/18514115/pexels-photo-18514115/free-photo-of-seats-of-sidewalk-cafe-in-sunlight-and-shadow.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' width={40} height={40} className='w-10 h-10 rounded-full object-cover'/>
        <span className='font-semibold'>Rohan</span>
        </div>
        <div className='flex gap-3 justify-end'>
       <button className='bg-red-600 text-white  cursor-pointer px-2 py-1 text-sm rounded-md'>Wish</button>
        </div>
        </div>
        {/* more bdays */}
        
    <div className='p-4 bg-slate-700 rounded-lg flex items-center gap-4'>
    <Image src='/gift.png' alt='' width={24} height={24} className='w-10 h-10 rounded-full object-cover'/>
    <Link href='/' className='flex flex-col gap-1 text-xs'>
    <span className='text-gray-300 font-semibold'>Upcoming Birthdays</span>
    <span className='text-gray-400'>see other 16 Upcoming birthdays</span>
    </Link>
    </div>

    </div>
  )
}