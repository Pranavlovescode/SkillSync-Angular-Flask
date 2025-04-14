import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const skillPostService = {
  getAllPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/skillposts`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching posts' };
    }
  },

  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/skillposts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching post' };
    }
  },

  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skillposts`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating post' };
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/skillposts/${postId}`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating post' };
    }
  },

  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/skillposts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while deleting post' };
    }
  },

  likePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skillposts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while liking post' };
    }
  },

  addComment: async (postId, comment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skillposts/${postId}/comments`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while adding comment' };
    }
  },
  
  addReplyToComment: async (postId, commentId, replyText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/skillposts/${postId}/comments`, 
        { 
          comment: replyText,
          parent_id: commentId 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while adding reply' };
    }
  },

  getComments: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skillposts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching comments' };
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/skillposts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching user posts' };
    }
  }
};