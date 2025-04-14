import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const skillPostService = {
  getAllPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/skillpost/get-all`,{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching posts' };
    }
  },

  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/skillpost/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching post' };
    }
  },

  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/skillpost/create`, postData, {
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating post' };
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/skillpost/${postId}`, postData, {
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating post' };
    }
  },

  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/skillpost/${postId}`, {
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while deleting post' };
    }
  },

  likePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skillpost/${postId}/like`, {}, {
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while liking post' };
    }
  },

  addComment: async (postId, comment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skillpost/${postId}/comments`, { comment }, {
        withCredentials:true
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
        `${API_URL}/skillpost/${postId}/comments`, 
        { 
          comment: replyText,
          parent_id: commentId 
        }, 
        {
          withCredentials:true
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
      const response = await axios.get(`${API_URL}/skillpost/${postId}/comments`, {
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching comments' };
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/skillpost/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching user posts' };
    }
  }
};