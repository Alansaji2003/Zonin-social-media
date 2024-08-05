"use client";
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Image from 'next/image'
import { useState } from 'react';
import AddPostButton from '../botton/AddPostButton';
import { addPost } from '@/lib/actions';



export default function AddPosts() {

  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState<any>();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  if (!isLoaded) return "Loading...";
  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setDesc(desc + emojiData.emoji);
    setEmojiPickerVisible(false);
  };
  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };


  return (
    <div className='p-4 bg-slate-800 text-white shadow-md rounded-lg flex gap-4 justify-between text-sm'>
      {/* avatar */}
      <Image src={user?.imageUrl || "/noAvatar.png"} alt='' width={48} height={48} className='w-12 h-12 object-cover rounded-full'>

      </Image>
      {/* post */}
      <div className='flex-1 '>
        {/* text-input */}
        <form action={(formData) => addPost(formData, img?.secure_url || "")} className='flex gap-4'>
      <textarea
        placeholder='What is on your mind?'
        className='flex-1 bg-slate-700 rounded-lg p-2'
        name="desc"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        
      />
      <div className='relative'>
        <Image
          src='/emoji.png'
          alt=''
          width={20}
          height={20}
          className='w-5 h-5 cursor-pointer self-end'
          onClick={toggleEmojiPicker}
        />
        {emojiPickerVisible && (
          <div className="absolute top-full mt-2">
            <EmojiPicker className="z-30" onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <AddPostButton />
      </div>
    </form>
        {/* post-options */}
        <div className='flex items-center gap-4 mt-4 text-gray-400 flex-wrap'>
          <CldUploadWidget options={{ clientAllowedFormats: ["image"] }}  uploadPreset="zoninApp" onSuccess={(result, { widget }) => { setImg(result.info); widget.close() }}>
            {({ open }) => {
              return (
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => open()}>
                  <Image src='/addimage.png' alt='' width={20} height={20} >

                  </Image>
                  photo
                </div>
              );
            }}
          </CldUploadWidget>

          <div className='flex items-center gap-2 cursor-pointer'>
            <Image src='/addVideo.png' alt='' width={20} height={20} >

            </Image>
            Vedio
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Image src='/addevent.png' alt='' width={20} height={20} >

            </Image>
            Event
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Image src='/poll.png' alt='' width={20} height={20} >

            </Image>
            poll
          </div>
        </div>
      </div>
    </div>
  )
}