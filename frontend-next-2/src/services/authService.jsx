import axios from 'axios';

const API_URL = 'https://skillsync-angular-backend.pranavtitambe.in/';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password },{withCredentials:true});
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData,{withCredentials:true});
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },

  logout: async() => {
    try{
      const response = await axios.post(`${API_URL}/auth/logout`, {},{withCredentials:true});
      return response.data;
    }
    catch(error){
      throw error.response?.data || { message: 'An error occurred during logout' };
    }
  },

  getCurrentUser: async() => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-profile`, {
        withCredentials:true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching current user' }; 
      
    }
  },

  updateProfile: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/auth/profile`, userData, {
        withCredentials:true,
      });
      
      // Update user in local storage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating profile' };
    }
  },

  getProfile: async (username) => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-user/${username}`,{
        withCredentials:true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching profile' };
    }
  }
};