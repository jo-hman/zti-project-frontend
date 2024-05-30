import React, {useState} from "react";
import { PostInterface } from "./PostModel";
import styled from "styled-components";
import { UserModel } from "../user/UserModel";
import {defaultHeadersWithAuthorization, postsUrl} from "../../utils/feedApi";
import {jwtLocalStorageKey} from "../../utils/jwtUtils";

const Post = ({ post, user }: { post: PostInterface, user: UserModel }) => {

    const [newComment, setNewComment] = useState('');

    const createComment = () => {
        fetch(postsUrl + `/${post.postId}/comments`, {
            method: 'POST',
            headers: defaultHeadersWithAuthorization(localStorage.getItem(jwtLocalStorageKey)),
            body: JSON.stringify({comment: newComment})
        })
            .then(response => window.location.reload())
    }

    return (
        <PostContainer>
            <TitleContainer>
                <PostTitle>{post.title}</PostTitle>
                <PostContent>by: {user === undefined ? '---' : user.email}</PostContent>
            </TitleContainer>
            <PostContent>{post.content}</PostContent>
            <CommentsSection>
                {post.comments && post.comments.map(comment => (
                    <Comment >
                        <CommentText>{comment.comment}</CommentText>
                        <CommentAuthor>by: {user === undefined ? '---' : user.email}</CommentAuthor>
                    </Comment>
                ))}
            </CommentsSection>
            <CommentInput type="text" placeholder="Add a comment..." onChange={(v) => setNewComment(v.target.value)} value={newComment}/>
            <StyledButton onClick={createComment} disabled={newComment === ''}>Comment</StyledButton>
        </PostContainer>
    )
}

const StyledButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const PostContainer = styled.div`
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PostTitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: 10px;
    color: #333;
`;

const PostContent = styled.p`
    font-size: 1em;
    margin-bottom: 15px;
    color: #666;
`;

const CommentsSection = styled.div`
    margin-top: 15px;
    border-top: 1px solid #eee;
    padding-top: 15px;
`;

const Comment = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const CommentText = styled.span`
  font-size: 0.9em;
  color: #555;
`;

const CommentAuthor = styled.span`
  font-size: 0.8em;
  color: #777;
`;

const CommentInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
`;

export default Post;
