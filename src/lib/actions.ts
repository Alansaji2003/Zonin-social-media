"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../../utils/dbConfig";
import { and, eq, gt } from "drizzle-orm";
import { blocks, comments, followers, followRequests, likes, posts, stories, users } from "../../utils/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { StoryWithUser, User } from "./types";

export const switchFollow = async(userId:string) => {
    const {userId:currentUser} = auth();
    if(!currentUser) throw new Error("User not authenticated");

    try{
        const existingFollow = await db.query.followers.findFirst({
             where:and(eq(followers.followerId, currentUser), eq(followers.followingId, userId))
        })

        if(existingFollow){
            await db.delete(followers).where(eq(followers.id, existingFollow.id));
        }else{
            const existingFollowRequest = await db.query.followRequests.findFirst({
                where:and(eq(followRequests.senderId,currentUser), eq(followRequests.recieverId, userId))
            })
            if(existingFollowRequest){
                await db.delete(followRequests).where(eq(followRequests.id, existingFollowRequest.id));
                
            }else{
                await db.insert(followRequests).values({
                    senderId:currentUser,
                    recieverId:userId,
                })
            }
        }
    }catch(e){
        console.log(e);
        throw new Error("Failed to switch follow status");
    }

}

export const switchBlock = async(userId:string) => {
    const {userId:currentUser} = auth();
    if(!currentUser) throw new Error("User not authenticated");

    try{
       const existingBlock = await db.query.blocks.findFirst({
              where:and(eq(blocks.blockerId, currentUser), eq(blocks.blockedId, userId))

       })
       if(existingBlock){
           await db.delete(blocks).where(eq(blocks.id, existingBlock.id));
       }else{
        await db.insert(blocks).values({
            blockerId:currentUser,
            blockedId:userId,
        })
       }
    }catch(e){
        console.log(e);
        throw new Error("Failed to block switch  status");
    }
}

export const acceptFollowRequest = async(userId:string) => {
    const {userId:currentUser} = auth();
    if(!currentUser) throw new Error("User not authenticated");

try{
    const existingFollowRequest = await db.query.followRequests.findFirst({
        where:and(eq(followRequests.senderId, userId), eq(followRequests.recieverId, currentUser))
    })
    if(existingFollowRequest){
        await db.delete(followRequests).where(eq(followRequests.id, existingFollowRequest.id));
    }
    await db.insert(followers).values({
        followerId:userId,
        followingId:currentUser
    })
}catch(e){
    console.log(e);
    throw new Error("Failed to accept follow request");
}
}

export const declineFollowRequest = async(userId:string) => {
    const {userId:currentUser} = auth();
    if(!currentUser) throw new Error("User not authenticated");
    try{
        const existingFollowRequest = await db.query.followRequests.findFirst({
            where:and(eq(followRequests.senderId, userId), eq(followRequests.recieverId, currentUser))
        })
        if(existingFollowRequest){
            await db.delete(followRequests).where(eq(followRequests.id, existingFollowRequest.id));
        }
        
    }catch(e){
        console.log(e);
        throw new Error("Failed to accept follow request");
    }
}

export const updateProfile = async (formData: any, cover: string) => {
    const fields = Object.fromEntries(Object.entries(formData).filter(([_, value]) => value !== ""));
    
    // zod validation
    const Profile = z.object({
      cover: z.string().optional(),
      f_name: z.string().max(60).optional(),
      l_name: z.string().max(60).optional(),
      description: z.string().max(255).optional(),
      city: z.string().max(60).optional(),
      school: z.string().max(60).optional(),
      work: z.string().max(60).optional(),
      website: z.string().max(60).optional()
    });
    
    const validatedFields = Profile.safeParse({ cover, ...fields });
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return { success: false, error: true };
    }
  
    const { userId } = auth();
    if (!userId) return { success: false, error: true };
  
    try {
      await db.update(users).set({
        cover: validatedFields.data.cover,
        f_name: validatedFields.data.f_name,
        l_name: validatedFields.data.l_name,
        description: validatedFields.data.description,
        city: validatedFields.data.city,
        school: validatedFields.data.school,
        work: validatedFields.data.work,
        website: validatedFields.data.website
      }).where(eq(users.id, userId));
  
      return { success: true, error: false };
    } catch (e) {
      console.log(e);
      return { success: false, error: true };
    }
  };

export const insertLike = async ({ postId, userId }: { postId: number, userId: string }) => {
   
    try {
        await db.insert(likes).values({
            postId: postId,
            userId: userId
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to like the post");
    }

};

export const deleteLike = async ({ postId, userId }: { postId: number, userId: string }) => {
    try {
        await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    } catch (error) {
        console.log(error);
        throw new Error("Failed to dislike the post");
    }
}
export async function getComments(postId: number) {
    const comRes = await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        with: {
            likes: true,
            user: true
        }
    });

    return comRes;
}

export const addComment = async(postId:number, desc:string) => {
    const {userId} = auth();
    if(!userId) throw new Error("User not authenticated");
  try{
    await db.insert(comments).values({
        postId,
        userId,
        description:desc
    })
  } catch(e){
    console.log(e);
    
    throw new Error("Failed to add comment");
  } 

}

export const addPost = async (formData:FormData, img:string) => {

    const desc = formData.get("desc") as string;
    if(!desc) return;
    const Desc = z.string().min(1).max(255);

    const validateddesc = Desc.safeParse(desc);

    if(!validateddesc.success){
        console.log("Invalid description");
        
        return;
    }   
    const {userId} = auth();
    if(!userId) throw new Error("User not authenticated");
    try{
        await db.insert(posts).values({
           
            userId:userId,
            description:validateddesc.data,
            img:img,
            
        })

        revalidatePath("/")
    }catch(e){
        console.log(e);
        throw new Error("Failed to add post");
    }
   
}

export const addVedioPost = async (formData:FormData, vedio:string) => {
  
      const desc = formData.get("desc") as string;
      if(!desc) return;
      const Desc = z.string().min(1).max(255);
  
      const validateddesc = Desc.safeParse(desc);
  
      if(!validateddesc.success){
          console.log("Invalid description");
          
          return;
      }   
      const {userId} = auth();
      if(!userId) throw new Error("User not authenticated");
      try{
          await db.insert(posts).values({
            
              userId:userId,
              description:validateddesc.data,
              img:vedio,
              
          })
  
          revalidatePath("/")
      }catch(e){
          console.log(e);
          throw new Error("Failed to add post");
      }
}

const getUserById = async (userId: string): Promise<User> => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to fetch user");
    }
  };
  
  export const getUserStories = async (userId: string): Promise<StoryWithUser[]> => {
    try {
      const currentDate = new Date();
      const Stories = await db.query.stories.findMany({
        where: gt(stories.expiresAt, currentDate),
      });
      
      const storiesWithUserDetails = await Promise.all(
        Stories?.map(async (story: any) => {
          const user = await getUserById(story.userId);
          return {
            ...story,
            user,
          };
        })
      );
      // console.log(storiesWithUserDetails);
      if(!storiesWithUserDetails) throw new Error("Failed to fetch stories");
      return storiesWithUserDetails;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to fetch stories");
    }
  };
  
  export const addStory = async (img: string): Promise<StoryWithUser> => {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");
  
    try {
      // Check if there's an existing story by the user
      const existingStory = await db.query.stories.findFirst({
        where: and(eq(stories.userId, userId)),
      });
  
      // If an existing story is found, delete it
      if (existingStory) {
        await db.delete(stories).where(eq(stories.id, existingStory.id));
      }
  
      // Add the new story
      const [story] = await db.insert(stories).values({
        userId: userId,
        img: img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }).returning();
  
      if (!story) {
        throw new Error("Failed to add story");
      }
  
      // Get the user details
      const user = await getUserById(userId);
  
      return {
        ...story,
        user,
      };
    } catch (e) {
      console.log(e);
      throw new Error("Failed to add story");
    }
  };
export const deletePost = async (postId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
    try {
        await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, userId)));
        revalidatePath("/");
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete the post");
    }
}

export const getAllUsers = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
    try {
        const Users = await db.query.users.findMany();
        return Users;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch users");
    }
}