"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import { StoryWithUser } from "@/lib/types";


const StoryList = ({
  initialStories,
  userId,
}: {
  initialStories: StoryWithUser[];
  userId: string;
}) => {
  console.log(initialStories);
  if (!initialStories) return <div>No stories</div>;

  const [storyList, setStoryList] = useState<StoryWithUser[]>(initialStories);
  const [isHidden, setIsHidden] = useState(true);
  const [img, setImg] = useState<any>(null);
  const [selectedStory, setSelectedStory] = useState<StoryWithUser | null>(null);

  const { user, isLoaded } = useUser();
  console.log(storyList);

  const add = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!img?.secure_url) return;

    try {
      const createdStory = await addStory(img.secure_url);
      // console.log(createdStory);
      setStoryList((prev) => [createdStory, ...prev]);
      setImg(null);
      
    } catch (err) {
      // Handle error
      console.error("Failed to add story", err);
    }
  };

  const viewStory = (story: StoryWithUser) => {
    setSelectedStory(story);
    setIsHidden(false);
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="zoninApp"
        
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer relative" onClick={() => open()}>
              <Image
                src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                alt=""
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 ring-red-500 object-cover"
              />
              {img ? (
                <button onClick={add} className="text-xs bg-blue-500 p-1 rounded-md text-white">
                  Send
                </button>
              ) : (
                <span className="font-medium">Add a story</span>
              )}
              <div className="absolute text-6xl text-gray-200 top-1">+</div>
            </div>
          );
        }}
      </CldUploadWidget>
      {/* STORY */}
      {storyList.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
          onClick={() => viewStory(story)}
        >
          <Image
            src={story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2 ring-white"
          />
          <span className="font-medium">
            {story.user.f_name || story.user.username}
          </span>
        </div>
      ))}
      {!isHidden && selectedStory && (
        <div 
          className="fixed top-0 left-0 bg-slate-800 w-screen h-screen z-50" 
          onClick={() => setIsHidden(true)}
        >
          <div className="relative w-full h-full flex items-center justify-center"> 
            <Image
              src={selectedStory.img || "/noAvatar.png"}
              alt=""
              layout="fill"
              objectFit="contain"
              className="w-auto h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;
