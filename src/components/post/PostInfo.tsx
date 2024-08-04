"use client";
import { deletePost } from '@/lib/actions';
import Image from 'next/image';
import React from 'react'



function PostInfo({postId}: {postId: number}) {
    const [open, setOpen] = React.useState(false);
    const deletePostWithId = deletePost.bind(null, postId)
  return (
    <div className='relative'>
        <Image className='cursor-pointer' alt='' src='/more.png' width={16} height={16} onClick={()=>setOpen(!open)}/>
        {open && (
            <div className='absolute top-4 right-0 w-32 flex flex-col gap-2 shadow-md bg-slate-700 text-white p-2 rounded-lg z-30'>
                <div className=' hover:bg-slate-700 rounded-md p-1 self-center'>Edit</div>
                
                <form action={deletePostWithId}>
                    <button className='cursor-pointer hover:bg-red-500 hover:text-white rounded-md p-1 w-full'>Delete</button>
                </form>
            </div>
                    )}
    </div>
  )
}

export default PostInfo