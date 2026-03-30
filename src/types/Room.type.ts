type author = {
    id: number;
    name: string;
};
type member = {
    member_name?: string;
    member_id: number;
    profile_image?: string | null;
};
type moderator = {
    id: number;
    username: string;
};
type RoomType = {
    id: string;
    author: author;
    parent_topic: string;
    isMember: boolean;
    members: member[];
    moderator: moderator[];
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

type TopicType = {
    id: number;
    topic: string;
    relatedRooms: number;
};

export { type RoomType,type TopicType };