'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { skillPostService } from '@/services/skillPostService';
import { Heart, MessageCircle, Reply } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await skillPostService.getPostById(id);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error(err);
        setLoading(false);
      }
    };

    // Get current user from localStorage
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await skillPostService.likePost(id);
      
      // Update the post state with the updated likes count and liked status
      setPost(prevPost => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          likes: response.likes
        },
        user_has_liked: response.liked
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const toggleCommentSection = () => {
    setShowComments(!showComments);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await skillPostService.addComment(id, newComment);
      
      // Update the post state with the new comments
      setPost(prevPost => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          comments: response.comments
        }
      }));
      
      // Clear the input field
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const replyToComment = (commentId) => {
    setReplyCommentId(commentId);
    setReplyText('');
  };

  const cancelReply = () => {
    setReplyCommentId(null);
    setReplyText('');
  };

  const submitReply = async () => {
    if (!replyText.trim() || !replyCommentId) return;

    try {
      const response = await skillPostService.addReplyToComment(id, replyCommentId, replyText);
      
      // Update the post state with the updated comments
      setPost(prevPost => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          comments: response.comments
        }
      }));
      
      // Clear the reply form
      setReplyCommentId(null);
      setReplyText('');
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString.$date || dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isCurrentUser = (userId) => {
    if (!post || !currentUser) return false;
    return String(userId) === String(currentUser._id || currentUser.id);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="alert alert-error max-w-md mx-auto">
          <span>{error}</span>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="alert alert-error max-w-md mx-auto">
          <span>Post not found</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="space-y-4 mx-auto w-full">
        <div className="card bg-neutral shadow-xl md:w-1/2 mx-auto w-full">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={post?.user?.profile_picture} alt={post?.user?.username} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{post?.skillpost?.title}</h3>
                  <span className="text-sm text-base-content/60">
                    {post?.user?.username}
                  </span>
                </div>
                <p className="mt-2">{post?.skillpost?.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {post?.skillpost?.tags?.map((tag, index) => (
                    <div key={index} className="badge badge-primary">
                      {tag}
                    </div>
                  ))}
                </div>
                
                {/* Media content */}
                {post?.skillpost?.image && (
                  <div className="mt-3">
                    <img src={post.skillpost.image} alt={post.skillpost.title} className="w-full rounded-lg" />
                  </div>
                )}
                
                {!post?.skillpost?.image && post?.skillpost?.video && (
                  <div className="mt-3">
                    <video src={post.skillpost.video} className="w-full rounded-lg" controls>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Like and Comment buttons */}
                <div className="mt-4 flex items-center gap-4">
                  <button className="btn btn-ghost btn-sm gap-2" onClick={handleLike}>
                    {post?.user_has_liked ? (
                      <Heart className="fill-current text-primary stroke-primary" />
                    ) : (
                      <Heart />
                    )}
                    {post?.skillpost?.likes} Likes
                  </button>
                  <button className="btn btn-ghost btn-sm gap-2" onClick={toggleCommentSection}>
                    <MessageCircle />
                    {post?.skillpost?.comments?.length || 0} Comments
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Comments</h4>
                    
                    {/* Add new comment */}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="input input-bordered w-full"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addComment()}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={addComment}
                      >
                        Post
                      </button>
                    </div>
                    
                    {/* No comments message */}
                    {!post?.skillpost?.comments?.length && (
                      <div className="text-center py-4 text-base-content/70">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                    
                    {/* Comments list */}
                    {post?.skillpost?.comments?.map((comment, index) => (
                      <div key={index} className="mb-4 border-b pb-2">
                        <div className="flex items-start gap-3">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img src={comment.profile_picture} alt={comment.username} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium">{comment.username}</span>
                              <span className="text-xs text-base-content/60">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                            
                            {/* Reply button */}
                            <button 
                              className="text-xs btn btn-ghost btn-xs gap-1 mt-1" 
                              onClick={() => replyToComment(comment.id)}
                            >
                              <Reply size={14} />
                              Reply
                            </button>

                            {/* Reply input */}
                            {replyCommentId === comment.id && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    className="input input-bordered input-sm w-full"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitReply()}
                                  />
                                  <div>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={submitReply}
                                    >
                                      Reply
                                    </button>
                                    <button
                                      className="btn btn-ghost btn-sm"
                                      onClick={cancelReply}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="pl-4 mt-2 border-l-2">
                                {comment.replies.map((reply, replyIndex) => (
                                  <div key={replyIndex} className="mb-2">
                                    <div className="flex items-start gap-2">
                                      <div className="avatar">
                                        <div className="w-6 rounded-full">
                                          <img src={reply.profile_picture} alt={reply.username} />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex items-baseline gap-2">
                                          <span className="font-medium text-sm">{reply.username}</span>
                                          <span className="text-xs text-base-content/60">{formatDate(reply.created_at)}</span>
                                        </div>
                                        <p className="text-sm">{reply.text}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}