
export type User = {
    id: string;
    username: string;
    avatar?: string | null;
    cover?: string | null;
    description?: string | null;
    f_name: string | null;
    l_name: string | null;
    city?: string | null;
    work?: string | null;
    school?: string | null;
    website?: string | null;
    createdAt: Date | null;
  };
  
  export type StoryWithUser = {
    id:number;
    img: string | null;
    createdAt: Date | null;
    expiresAt: Date | null;
    userId: string;
    user: User;
  };
  