import AddPosts from "@/components/post/AddPosts" 
import LeftMenu from "@/components/LeftMenu/LeftMenu"
import PostFeed from "@/components/PostFeed"
import RightMenu from "@/components/RightMenu/RightMenu"
import Stories from "@/components/Stories"
import FriendRequest from "@/components/RightMenu/FriendRequest"


const Homepage = () => {
  return (
    <div className='flex gap-6 pt-6'>
      <div className="hidden xl:block w-[20%]"><LeftMenu type="home"/></div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6"> 
          <Stories/>
          <AddPosts/>
          <PostFeed username="false"/>
          
        </div>
      </div>
      <div className="hidden lg:block w-[30%]"><RightMenu/></div>
      {/* <div className="md:hidden">
      <FriendRequest />
      </div> */}
     
    </div>
  )
}

export default Homepage