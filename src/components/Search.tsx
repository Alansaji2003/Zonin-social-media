import { getAllUsers } from '@/lib/actions';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
type User = {
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
};

function Search() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchInput === '') {
      setSearchResults([]);
    } else {
      const results = users.filter(user =>
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchInput, users]);

  useEffect(() => {
    if (loading && pathname.includes('/profile/')) {
      setLoading(false);
    }
    
  }, [loading, pathname]);

  const goToProfile = async (username:String | null | undefined) => {
    setLoading(true);
    router.push(`/profile/${username}`);
  };

  return (
    <div className="relative xl:flex p-2 bg-slate-700 items-center text-white rounded-md  sm:w-full md:w-3/4 lg:w-2/3 xl:w-1/2" ref={searchContainerRef}>
  <input
    type="text"
    placeholder="Search.."
    className="bg-transparent outline-none w-full"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />
  <Image className='hidden md:block' src="/search.png" alt="Search Icon" width={14} height={14} />
  {searchResults.length > 0 && (
    <div className="absolute left-0 top-full mt-2 w-full bg-slate-700 text-white rounded-md shadow-lg z-10">
      {searchResults.map((user) => (
        <div onClick={() => goToProfile(user?.username)} key={user.id} className="px-4 py-2 hover:bg-gray-500 cursor-pointer">
          {user.username} {loading && <FaSpinner className="animate-spin text-white" />}
        </div>
      ))}
    </div>
  )}
</div>

  );
}

export default Search;
