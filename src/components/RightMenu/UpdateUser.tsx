"use client";
import { updateProfile } from '@/lib/actions';
import Image from 'next/image';
import React, { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ImSpinner3 } from 'react-icons/im';

type UserType = {
  id: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  f_name: string | null;
  l_name: string | null;
  description: string | null;
  city: string | null;
  school: string | null;
  work: string | null;
  website: string | null;
  createdAt: Date | null;
  followerCount: number;
  followingCount: number;
  postsCount: number;
};

function UpdateUser({ user }: { user?: UserType[] }) {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(user && user[0].cover ? user[0].cover : null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const result = await updateProfile(data, cover);
    if (result.success) {
      router.refresh();
      setOpen(false);
      reset();
    }
    setLoading(false);
  };

  if (!user || user.length === 0) return null;

  return (
    <div>
      <span className='text-red-600 text-sx cursor-pointer' onClick={() => setOpen(true)}>Edit</span>
      {open && (
        <div className='absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50'>
          <form className='p-12 bg-slate-800 text-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-[850px] relative' onSubmit={handleSubmit(onSubmit)}>
            <h1>Update Profile</h1>
            <div className='mt-4 text-xs text-gray-500'>
              use the navbar profile icon to change profile picture or username
            </div>

            <CldUploadWidget
              uploadPreset="zoninApp"
              options={{ clientAllowedFormats: ["image"] }}
              onSuccess={(result) => {
                if (typeof result.info !== 'string' && result.info?.secure_url) {
                  setCover(result.info.secure_url);
                }
              }}
            >
              {({ open }) => {
                return (
                  <div className='flex flex-col gap-4 my-4' onClick={() => open()}>
                    <label htmlFor="">Cover Picture</label>
                    <div className='flex items-center gap-2 cursor-pointer'>
                      <Image
                        src={cover || "https://images.pexels.com/photos/1260727/pexels-photo-1260727.jpeg?auto=compress&cs=tinysrgb&w=600"}
                        alt=''
                        width={48}
                        height={32}
                        className='w-12 h-8 rounded-md object-cover '
                      />
                      <span className='text-xs underline text-gray-600'>Change</span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>


            {/* input */}
            <div className='flex flex-wrap justify-between gap-2 xl:gap-4 '>
              <div className='flex flex-col gap-4 '>
                <label htmlFor="" className='text-sx text-gray-500 '>First Name</label>
                <input type="text" placeholder={user[0].f_name || "Alan"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('f_name')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>Last name</label>
                <input type="text" placeholder={user[0].l_name || "Saji"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('l_name')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>Bio</label>
                <input type="text" placeholder={user[0].description || "Still on that grind.."} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm " {...register('description')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>City</label>
                <input type="text" placeholder={user[0].city || "Thiruvananthapuram"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('city')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>School</label>
                <input type="text" placeholder={user[0].school || "Harvard"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('school')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>Work</label>
                <input type="text" placeholder={user[0].work || "NVIDIA"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('work')} />
              </div>

              <div className='flex flex-col gap-4'>
                <label htmlFor="" className='text-sx text-gray-500 '>Website</label>
                <input type="text" placeholder={user[0].website || "www.you.com?"} className="ring-1 text-white bg-slate-700 ring-gray-300 p-[13px] rounded-md text-sm" {...register('website')} />
              </div>
            </div>
            <button className='bg-red-600 p-2 mt-2 rounded-md text-white flex items-center justify-center' disabled={loading}>
              {loading ? <ImSpinner3 className='animate-spin mr-2' /> : 'Update'}
            </button>
            <div className='absolute text-lg right-6 top-5 cursor-pointer' onClick={() => setOpen(false)}>
              X
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
