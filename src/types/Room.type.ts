export type Author = {
  id: number;
  name: string;
};
export type Member = {
  member_name?: string;
  member_id: number;
  profile_image?: string | null;
};
export type Moderator = {
  id: number;
  username: string;
};
export type RoomType = {
  id: string;
  author: Author;
  parent_topic: string;
  isMember: boolean;
  members: Member[];
  moderator: Moderator[];
  name: string;
  description: string;
  topic: string;
  reason?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  has_pending_request: boolean;
};

export type TopicType = {
  id: number;
  topic: string;
  relatedRooms: number;
};


