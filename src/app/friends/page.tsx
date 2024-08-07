import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className='bg-slate-800 h-screen text-white'>
        <div className='flex items-center  justify-between'>
          <div className='h-screen rounded-md bg-slate-700 w-[40%] flex justify-center'>
            <h1 className='text-red-500 text-2xl font-bold mt-5'>Followers</h1>
          </div>
          <div className='h-screen rounded-md bg-slate-700 w-[40%] flex justify-center'>
          <h1 className='text-red-500 text-2xl font-bold mt-5'>Following</h1>
          </div>
        </div>
    </div>
  )
}