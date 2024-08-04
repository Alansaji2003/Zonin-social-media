"use client";

import React from 'react'
import { useFormStatus } from 'react-dom';
import { FaSpinner } from 'react-icons/fa';

function AddPostButton() {

    const {pending} = useFormStatus();
  return (
    <button className='bg-red-500 p-2 mt-2 rounded-md text-white disabled:bg-red-300 disabled:cursor-not-allowed' disabled={pending}>{
        pending?<div className='flex items-center gap-2'>
             <FaSpinner className="animate-spin text-black"/>
             Sending
        </div>:"Send"
    }</button>
  )
}

export default AddPostButton