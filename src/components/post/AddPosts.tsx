"use client";
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Image from 'next/image';
import { useState } from 'react';
import AddPostButton from '../botton/AddPostButton';
import { addPost, addVedioPost } from '@/lib/actions';
import { set } from 'zod';

export default function AddPosts() {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [UIimage, setUIimage] = useState<string>("/addimage.png");
  const [UIvideo, setUIvideo] = useState<string>("/addVideo.png");
  const [imgtext, setimgText] = useState<string>("photo");
  const [vdotext, setvdoText] = useState<string>("vedio");
  const [placeholderTxt, setPlaceholderTxt] = useState<string>("What's on your mind?");
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return "Loading...";

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setDesc(desc + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append('desc', desc);
    
    if (img) {
      await addPost(formData, img.secure_url);
    } else if (video) {
      await addVedioPost(formData, video.secure_url);
    }else{
      await addPost(formData, "");
    }

    setDesc('');
    setImg(null);
    setVideo(null);
    setUIimage("/addimage.png");
    setvdoText("vedio");
    setimgText("photo");
    setUIvideo("/addVideo.png");
    setPlaceholderTxt("What's on your mind?");
    setLoading(false);
  };

  return (
    <div className='p-4 bg-slate-800 text-white shadow-md rounded-lg flex gap-4 justify-between text-sm'>
      {/* avatar */}
      <Image src={user?.imageUrl || "/noAvatar.png"} alt='' width={48} height={48} className='w-12 h-12 object-cover rounded-full' />
      
      {/* post */}
      <div className='flex-1'>
        <form onSubmit={handleSubmit} className='flex gap-4'>
          <textarea
            placeholder={placeholderTxt}
            className='flex-1 bg-slate-700 rounded-lg p-2'
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className=' relative'>
            <Image
              
              src='/emoji.png'
              alt=''
              width={20}
              height={20}
              className='hidden md:block w-5 h-5 cursor-pointer self-end'
              onClick={toggleEmojiPicker}
            />
            {emojiPickerVisible && (
              <div className="absolute top-full mt-2">
                <EmojiPicker className=" z-30" onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <AddPostButton loading={loading}/>
          </div>
        </form>
        
        {/* post-options */}
        <div className='flex items-center gap-4 mt-4 text-gray-400 flex-wrap'>
          <CldUploadWidget 
            options={{ clientAllowedFormats: ["image"] }} 
            uploadPreset="zoninApp" 
            onSuccess={(result, { widget }) => { 
              if (typeof result.info !== 'string' && result.info?.secure_url) {
                setUIimage(result.info.secure_url);
                setPlaceholderTxt("Add a caption for your photo....!");
                setimgText("photo ready!");
                setImg(result.info);
              }
              widget.close();
            }}>
            {({ open }) => (
              <div className='flex items-center gap-2 cursor-pointer' onClick={() => open()}>
                <Image src={UIimage} alt='' width={20} height={20} />
                {imgtext}
              </div>
            )}
          </CldUploadWidget>

          <CldUploadWidget 
            
            options={{ clientAllowedFormats: ["video"] }} 
            uploadPreset="zoninApp" 
            onSuccess={(result, { widget }) => { 
              if (typeof result.info !== 'string' && result.info?.secure_url) {
                setUIvideo("/videoUP.png");
                setVideo(result.info);
                setPlaceholderTxt("Add a caption for your video....!");
                setvdoText("vedio ready");
              }
              widget.close();
            }}>
            {({ open }) => (
              <div className='flex items-center gap-2 cursor-pointer' onClick={() => open()}>
                <Image src={UIvideo} alt='' width={20} height={20} />
                {vdotext}
              </div>
            )}
          </CldUploadWidget>

          <div className='flex items-center gap-2 cursor-pointer'>
            <Image src='/addevent.png' alt='' width={20} height={20} />
            Event
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Image src='/poll.png' alt='' width={20} height={20} />
            Poll
          </div>
        </div>
      </div>
    </div>
  );
}
