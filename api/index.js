import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';
const axiosInstance = axios.create({ baseURL: API_URL });


export const fetchPosts = async (postsRef) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/posts`);
        postsRef.value = response.data;
    } catch (error) {
        throw new Error('Error fetching posts');
    }
};

export const fetchUsers = async (usersRef) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/users`);
        usersRef.value = response.data;
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

export const deletePost = async (postId) => {
    try {
        await axiosInstance.delete(`${API_URL}/posts/${postId}`);
    } catch (error) {
        throw new Error('Error deleting post');
    }
};


export const createPost = async (post) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/posts`, post);
        return response.data;
    } catch (error) {
        throw new Error('Error creating post');
    }
};

export const getSinglePost = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error getting post');
    }
};

export const updatePost = async (id, post) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/posts/${id}`, post);
        return response.data;
    } catch (error) {
        throw new Error('Error updating post');
    }
};
