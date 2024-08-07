"use client"
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa';

function Button({ username }: {  username:string|null | undefined}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const goToProfile = async () => {
    setLoading(true);
    router.push(`/profile/${username}`);
  };

  useEffect(() => {
    if (loading && pathname === `/profile/${username}`) {
      setLoading(false);
    }
    
  }, [loading, pathname, username]);

  return (
    <div>
      {loading ? (
        <FaSpinner className="animate-spin text-white" />
      ) : (
        <button onClick={goToProfile} className="bg-red-600 text-white text-xs p-2 rounded-md hover:bg-red-500">
          My profile
        </button>
      )}
    </div>
  );
}

export default Button;
