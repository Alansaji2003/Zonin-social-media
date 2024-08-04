import Image from 'next/image'
import Link from 'next/link'
import { db } from '../../../utils/dbConfig'; 
import { eq } from 'drizzle-orm';
import { followRequests } from '../../../utils/schema';
import { auth } from '@clerk/nextjs/server';
import FriendRequestList from './FriendRequestList';
type Props = {}

export default async function FriendRequest({}: Props) {

  const {userId} = auth();

  if(!userId) return null;

  const requests = await db.query.followRequests.findMany({
    where:eq(followRequests.recieverId, userId),
    with:{
      sender:true
    }
  })
  // console.log(requests);
  if(requests.length === 0) return null;

  return (
    <div className='p-4 bg-slate-800 text-white rounded-lg shadow-md text-sm flex flex-col gap-4'>
        {/* toppart */}
        <div className='flex justify-between items-center font-medium'>
            <span className='text-gray-300'>Friend Requests</span>
            <Link href='/' className='text-red-500 text-xs'>See all</Link>
        </div>
        {/* userpart */}
        <FriendRequestList requests={requests}/>
        

        

        
    </div>
  )
}