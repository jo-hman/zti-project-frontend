import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { defaultHeadersWithAuthorization, postsUrl, usersUrl } from "../utils/feedApi";
import { jwtLocalStorageKey } from "../utils/jwtUtils";
import { PostInterface } from "./post/PostModel";
import Header from "./Header";
import Post from "./post/Post";
import { UserModel } from "./user/UserModel";
import User from "./user/User";

function getUser(userId: string, users: UserModel[]) {
    return users.find(user => user.id === userId);
}

const Feed = () => {
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [users, setUsers] = useState<UserModel[]>([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");

    const getPosts = () => {
        fetch(postsUrl, {
            method: 'GET',
            headers: defaultHeadersWithAuthorization(localStorage.getItem(jwtLocalStorageKey)),
        })
            .then(response => response.json())
            .then(response => {
                setPosts(response);
                setIsLoadingPosts(false);
            });
    }

    const getUsers = () => {
        fetch(usersUrl, {
            method: 'GET',
            headers: defaultHeadersWithAuthorization(localStorage.getItem(jwtLocalStorageKey)),
        })
            .then(response => response.json())
            .then(response => {
                setUsers(response);
                setIsLoadingUsers(false);
            });
    }

    const handleCreatePost = () => {
        fetch(postsUrl, {
            method: 'POST',
            headers: defaultHeadersWithAuthorization(localStorage.getItem(jwtLocalStorageKey)),
            body: JSON.stringify({title: newPostTitle, content: newPostContent})
        })
            .then(response => window.location.reload())
    }

    useEffect(() => {
        getPosts();
        getUsers();
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <Header />
            </HeaderContainer>
            <MainContent>
                <UsersContainer>
                    <NewPostTitle>Users</NewPostTitle>
                    {isLoadingUsers ? (
                        <p>Loading...</p>
                    ) : (
                        users.map(user => <User key={user.id} user={user} />)
                    )}
                </UsersContainer>
                <PostsContainer>
                    <NewPostTitle>Create New Post</NewPostTitle>
                    <NewPostForm onSubmit={handleCreatePost}>
                        <input
                            type="text"
                            value={newPostTitle}
                            onChange={e => setNewPostTitle(e.target.value)}
                            placeholder="Title"
                            required
                        />
                        <textarea
                            value={newPostContent}
                            onChange={e => setNewPostContent(e.target.value)}
                            placeholder="What's on your mind?"
                            required
                        />
                        <button type="submit">Post</button>
                    </NewPostForm>

                    {isLoadingPosts && isLoadingUsers ? (
                        <p>Loading...</p>
                    ) : (
                        posts.map(post => (
                            <Post
                                key={post.postId}
                                post={post}
                                user={getUser(post.userId, users) as UserModel}
                            />
                        ))
                    )}
                </PostsContainer>
            </MainContent>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
`;

const HeaderContainer = styled.div`
    flex-shrink: 0;
`;

const MainContent = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden;
`;

const UsersContainer = styled.div`
    background-color: #f4f4f4;
    padding: 20px;
    width: 250px;
    overflow-y: auto;
    flex-shrink: 0;
`;

const PostsContainer = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

const NewPostTitle = styled.h2`
    margin-bottom: 10px;
    color: #333;
`;

const NewPostForm = styled.form`
    margin-bottom: 20px;

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1em;
    }

    textarea {
        width: 100%;
        height: 100px;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
        font-size: 1em;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1em;
        cursor: pointer;

        &:hover {
            background-color: #0056b3;
        }
    }
`;

export default Feed;
