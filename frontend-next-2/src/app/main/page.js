"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { skillPostService } from "@/services/skillPostService";
import { Heart, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await skillPostService.getAllPosts();
        setPosts(data.posts || []);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await skillPostService.likePost(postId);

      // Update the posts state with the updated post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: response.likes,
                liked_by_user: response.liked_by_user,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="space-y-4 mx-auto w-full">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error max-w-md mx-auto">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="mb-4">
              No posts found. Be the first to share your skills!
            </p>
            <Link href="/main/create-post" className="btn btn-primary">
              Create Post
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <div
              key={post.id}
              className="card bg-neutral shadow-xl md:w-1/2 mx-auto w-full"
            >
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <Link
                        href={`/main/profile/${
                          post.author?.username || post.author?.id
                        }`}
                        legacyBehavior>
                        <img
                          src={
                            post.author?.profile_picture ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt={post.author?.username || "User"}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/main/posts/${post.id}`} legacyBehavior>
                        <h3 className="font-bold hover:underline hover:cursor-pointer hover:text-primary">
                          {post.title}
                        </h3>
                      </Link>
                      <Link
                        href={`/main/profile/${
                          post.author?.username || post.author?.id
                        }`}
                        legacyBehavior>
                        <span className="text-sm text-base-content/60 hover:underline hover:cursor-pointer hover:text-primary">
                          {post.author?.username || "Anonymous"}
                        </span>
                      </Link>
                    </div>
                    <p className="mt-2">{post.content || post.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {post.tags &&
                        post.tags.map((tag) => (
                          <div key={tag} className="badge badge-primary">
                            {tag}
                          </div>
                        ))}
                    </div>

                    {post.image_url && (
                      <div className="mt-3">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full"
                        />
                      </div>
                    )}

                    {post.video_url && !post.image_url && (
                      <div className="mt-3">
                        <video src={post.video_url} className="w-full" controls>
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        className="btn btn-ghost btn-sm gap-2"
                        onClick={() => handleLike(post.id)}
                      >
                        {post.liked_by_user ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-heart text-error"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        ) : (
                          <Heart size={20} />
                        )}
                        {post.likes || 0}
                      </button>

                      <Link
                        href={`/main/posts/${post.id}`}
                        className="btn btn-ghost btn-sm gap-2"
                        legacyBehavior>
                        <MessageCircle size={20} />
                        {post.comments?.length || 0}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
