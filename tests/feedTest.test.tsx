import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Feed from "../src/feed/Feed";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Feed Component', () => {
    beforeEach(() => {
        // Clear mocks before each test
        mockFetch.mockClear();
    });

    test('renders without crashing', () => {
        render(<Feed />);
    });

    test('loads users and posts on mount', async () => {
        mockFetch.mockResolvedValueOnce({
            json: async () => [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }],
        });
        mockFetch.mockResolvedValueOnce({
            json: async () => [{ postId: '1', userId: '1', title: 'Post 1', content: 'Content 1' }],
        });

        const { getByText } = render(<Feed />);

        await waitFor(() => {
            expect(getByText('Loading...')).toBeInTheDocument(); // Checking loading state
        });

        await waitFor(() => {
            expect(getByText('User 1')).toBeInTheDocument(); // Checking if users are loaded
        });

        expect(getByText('Post 1')).toBeInTheDocument(); // Checking if posts are loaded
    });

    test('creates new post', async () => {
        mockFetch.mockResolvedValueOnce({}); // Mock successful post creation

        const { getByPlaceholderText, getByText } = render(<Feed />);

        fireEvent.change(getByPlaceholderText('Title'), { target: { value: 'New Post Title' } });
        fireEvent.change(getByPlaceholderText('What\'s on your mind?'), { target: { value: 'New Post Content' } });
        fireEvent.click(getByText('Post'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/posts', { // Checking if the correct URL and body were sent
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'New Post Title', content: 'New Post Content' }),
            });
        });

    });
});
