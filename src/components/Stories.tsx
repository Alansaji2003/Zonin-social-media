"use client";
import { getUserStories } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import StoryList from "./StoryList";
import { StoryWithUser } from "@/lib/types";

const ParentComponent = () => {
  const { user, isLoaded } = useUser();
  const [stories, setStories] = useState<StoryWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (isLoaded && user) {
        try {
          const fetchedStories = await getUserStories(user.id);
          setStories(fetchedStories);
        } catch (err) {
          console.error("Failed to fetch stories", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStories();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return <div className="p-4 bg-slate-800 text-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide"><div className="flex gap-8 w-max">Loading...</div></div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="p-4 bg-slate-800 text-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList initialStories={stories} userId={user.id} />
      </div>
    </div>
  )
};

export default ParentComponent;
