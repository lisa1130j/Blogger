export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  date: Date;
}

export interface CommunityTopic {
  id: string;
  title: string;
  description: string;
  posts: CommunityPost[];
}
