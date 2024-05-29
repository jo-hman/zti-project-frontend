interface Comment {
    comment: string
}

export interface PostInterface {
    postId: string;
    userId: string;
    title: string;
    content: string;
    comments?: Comment[]

}
