'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { skillPostService } from '@/services/skillPostService';
import Navbar from '@/components/Navbar/Navbar';

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    image: null,
    video: null
  });
  const [tags, setTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   // Check if user is logged in
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/auth/login?message=Please login to create a post');
  //   } else {
  //     setIsLoggedIn(true);
  //   }
  // }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      
      // Create preview
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const removeVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: null
    }));
    setVideoPreview(null);
  };

  const addTag = () => {
    if (formData.tag && !tags.includes(formData.tag)) {
      setTags([...tags, formData.tag]);
      setFormData(prev => ({
        ...prev,
        tag: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      
      // Add tags
      tags.forEach(tag => {
        postData.append('tags', tag);
      });
      
      // Add media files if they exist
      if (formData.image) {
        postData.append('image', formData.image);
      }
      
      if (formData.video) {
        postData.append('video', formData.video);
      }

      await skillPostService.createPost(postData);
      setShowSuccessAlert(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        tag: '',
        image: null,
        video: null
      });
      setTags([]);
      setImagePreview(null);
      setVideoPreview(null);
      
      // Show success alert for 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        router.push('/main');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-3xl">
        {showSuccessAlert && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Your post has been created successfully!</span>
          </div>
        )}

        <div className="card shadow-xl bg-neutral">
          <div className="card-body">
            <h2 className="card-title mb-4">Create a New Post</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="form-control">
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input input-bordered" 
                  placeholder="Title"
                  required
                />
                {formData.title === '' && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Title is required.
                    </span>
                  </label>
                )}
              </div>

              {/* Description Input */}
              <div className="form-control">
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24" 
                  placeholder="What's on your mind?"
                  required
                ></textarea>
                {formData.description === '' && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Content is required.
                    </span>
                  </label>
                )}
              </div>

              {/* Tags Input */}
              <div className="form-control">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    placeholder="Add a tag" 
                    className="input input-bordered flex-grow"
                  />
                  <button type="button" className="btn btn-square" onClick={addTag}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div key={tag} className="badge badge-primary gap-2">
                    {tag}
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => removeTag(tag)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload an Image</span>
                </label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="file-input file-input-bordered w-full"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Image preview" className="max-w-full h-auto rounded-lg shadow-lg" />
                  <button type="button" className="btn btn-sm btn-error mt-2" onClick={removeImage}>Remove Image</button>
                </div>
              )}

              {/* Video Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload a Video</span>
                </label>
                <input 
                  type="file" 
                  onChange={handleVideoChange} 
                  accept="video/*" 
                  className="file-input file-input-bordered w-full"
                />
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-4">
                  <video src={videoPreview} controls className="max-w-full h-auto rounded-lg shadow-lg"></video>
                  <button type="button" className="btn btn-sm btn-error mt-2" onClick={removeVideo}>Remove Video</button>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading || !formData.title || !formData.description}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <span>Create Post</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}