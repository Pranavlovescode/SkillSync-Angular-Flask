"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { skillPostService } from "@/services/skillPostService";
import {
  Heart,
  MessageCircle,
  Reply,
  Share2,
  ArrowLeft,
  MoreVertical,
  ThumbsUp,
  Bookmark,
  AlertTriangle,
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "date-fns";

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await skillPostService.getPostById(id);
        console.log("Post data:", data);
        setPost(data);
        setCurrentUser(data.current_user);
      } catch (err) {
        setError("Failed to load post. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (likeInProgress) return;

    try {
      setLikeInProgress(true);

      // Optimistic update for better UX
      setPost((prevPost) => ({
        ...prevPost,
        user_has_liked: !prevPost.user_has_liked,
        skillpost: {
          ...prevPost.skillpost,
          likes: prevPost.user_has_liked
            ? Math.max(0, prevPost.skillpost.likes - 1)
            : (prevPost.skillpost.likes || 0) + 1,
        },
      }));

      // Add animation
      if (!post.user_has_liked) {
        setLikeAnimation(true);
        setTimeout(() => setLikeAnimation(false), 1000);
      }

      const response = await skillPostService.likePost(id);

      // Update with actual response
      setPost((prevPost) => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          likes: response.likes,
        },
        user_has_liked: response.liked_by_user,
      }));
    } catch (err) {
      console.error("Error liking post:", err);

      // Revert on error
      setPost((prevPost) => ({
        ...prevPost,
        user_has_liked: !prevPost.user_has_liked,
        skillpost: {
          ...prevPost.skillpost,
          likes: prevPost.user_has_liked
            ? (prevPost.skillpost.likes || 0) + 1
            : Math.max(0, prevPost.skillpost.likes - 1),
        },
      }));
    } finally {
      setLikeInProgress(false);
    }
  };

  const toggleCommentSection = () => {
    setShowComments(!showComments);
  };

  const addComment = async () => {
    if (!newComment.trim() || commentSubmitting) return;

    try {
      setCommentSubmitting(true);
      const response = await skillPostService.addComment(id, newComment);

      // Update the post state with the new comments
      setPost((prevPost) => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          comments: response.comments,
        },
      }));

      // Clear the input field
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const replyToComment = (commentId) => {
    setReplyCommentId(commentId === replyCommentId ? null : commentId);
    setReplyText("");
  };

  const submitReply = async () => {
    if (!replyText.trim() || !replyCommentId || commentSubmitting) return;

    try {
      setCommentSubmitting(true);
      const response = await skillPostService.addReplyToComment(
        id,
        replyCommentId,
        replyText
      );

      // Update the post state with the updated comments
      setPost((prevPost) => ({
        ...prevPost,
        skillpost: {
          ...prevPost.skillpost,
          comments: response.comments,
        },
      }));

      // Clear the reply form
      setReplyCommentId(null);
      setReplyText("");
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString.$date || dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-white hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <Skeleton className="h-8 w-32" />
        </div>

        <Card className="bg-zinc-900/80 border border-zinc-800 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-40 w-full rounded-md" />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <div className="flex gap-3">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button
            className="text-white hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Post not found</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button
            className="text-white hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-white hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-white">Post Detail</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800"
            >
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900 border-zinc-800 text-white"
          >
            <DropdownMenuItem className="cursor-pointer text-white hover:bg-zinc-800">
              <Bookmark className="mr-2 h-4 w-4" />
              Save Post
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-white hover:bg-zinc-800">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/main/profile/${post?.user?.username}`}>
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                <AvatarImage
                  src={
                    post?.user?.profile_picture ||
                    `${post.user?.first_name?.charAt(0) || ""}${
                      post.user?.last_name?.charAt(0) || ""
                    }`
                  }
                  alt={post?.user?.username || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-white">
                  {post?.user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/main/profile/${post?.user?.username}`}>
                <CardTitle className="text-lg text-white hover:text-primary transition-colors">
                  {post?.user?.username || "Anonymous"}
                </CardTitle>
              </Link>
              <CardDescription className="text-sm text-gray-400">
                {formatDate(post?.skillpost?.created_at || post?.created_at)}
              </CardDescription>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {post?.skillpost?.title}
          </h2>
        </CardHeader>

        <CardContent>
          <div className="prose prose-invert max-w-full">
            <p className="text-gray-300 whitespace-pre-line">
              {post?.skillpost?.description || post?.skillpost?.content}
            </p>
          </div>

          {/* Tags */}
          {post?.skillpost?.tags && post?.skillpost?.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.skillpost.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/10 text-purple-500 hover:bg-primary/20"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Media content */}
          {post?.skillpost?.image && (
            <div className="mt-6 rounded-md overflow-hidden shadow-lg">
              <img
                src={post.skillpost.image}
                alt={post.skillpost.title}
                className="w-full object-cover hover:scale-[1.01] transition-transform"
              />
            </div>
          )}

          {!post?.skillpost?.image && post?.skillpost?.video && (
            <div className="mt-6 rounded-md overflow-hidden shadow-lg">
              <video src={post.skillpost.video} className="w-full" controls>
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </CardContent>

        <Separator className="my-1 bg-zinc-800" />

        <CardFooter className="py-4 flex justify-between">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 text-white hover:bg-zinc-800 ${
                post?.user_has_liked ? "text-rose-500" : ""
              } 
                ${
                  likeAnimation ? "animate-like-pulse" : ""
                } relative overflow-visible`}
              disabled={likeInProgress}
              onClick={handleLike}
            >
              {post?.user_has_liked ? (
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
                  className={`lucide lucide-heart ${
                    likeAnimation ? "animate-like-bounce" : ""
                  }`}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              ) : (
                <Heart
                  size={20}
                  className={likeAnimation ? "animate-like-bounce" : ""}
                />
              )}
              <span
                className={`transition-all ${likeAnimation ? "scale-125" : ""}`}
              >
                {post?.skillpost?.likes || 0}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white hover:bg-zinc-800"
              onClick={toggleCommentSection}
            >
              <MessageCircle size={20} />
              {post?.skillpost?.comments?.length || 0}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-white hover:bg-zinc-800"
          >
            <Share2 size={20} />
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      {showComments && (
        <Card className="mt-6 bg-zinc-900 border border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Comments</CardTitle>
            <CardDescription className="text-gray-400">
              Join the conversation with others
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Add new comment */}
            <div className="flex items-center gap-2 mb-6">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser?.profile_picture} />
                <AvatarFallback className="bg-primary/30 text-white"></AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-10"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), addComment())
                  }
                />
                <Button
                  className="self-end bg-purple-500 hover:bg-purple-700 text-white"
                  // disabled={!newComment.trim() || commentSubmitting}
                  onClick={addComment}
                >
                  {commentSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* No comments message */}
            {(!post?.skillpost?.comments ||
              post.skillpost.comments.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="mx-auto h-8 w-8 opacity-50 mb-2" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-6 mt-4">
              {post?.skillpost?.comments?.map((comment, index) => (
                <div
                  key={index}
                  className="group relative bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <AvatarImage
                        src={
                          comment.profile_picture ||
                          `${post.user?.first_name?.charAt(0) || ""}${
                            post.user?.last_name?.charAt(0) || ""
                          }`
                        }
                        alt={comment.username}
                      />
                      <AvatarFallback className="bg-primary/30 text-white">
                        {comment.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-white">
                            {comment.username}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-zinc-700"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                      <p className="text-sm mt-1 text-gray-300 whitespace-pre-line">
                        {comment.text}
                      </p>

                      {/* Like and Reply buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs gap-1 text-gray-300 hover:bg-zinc-700"
                        >
                          <ThumbsUp size={14} />
                          Like
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs gap-1 text-gray-300 hover:bg-zinc-700"
                          onClick={() => replyToComment(comment.id)}
                        >
                          <Reply size={14} />
                          Reply
                        </Button>
                      </div>

                      {/* Reply input */}
                      {replyCommentId === comment.id && (
                        <div className="mt-3 pl-4 border-l-2 border-zinc-700">
                          <div className="flex items-start gap-2 mt-2">
                            <Avatar className="h-6 w-6 mt-1">
                              <AvatarFallback className="bg-primary/30 text-white text-xs">
                                `${post.user?.first_name?.charAt(0) || ""}$
                                {post.user?.last_name?.charAt(0) || ""}`
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder="Write a reply..."
                                className="min-h-10 resize-none bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setReplyCommentId(null)}
                                  disabled={commentSubmitting}
                                  className="hover:text-white border-zinc-700 hover:bg-zinc-700"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={submitReply}
                                  disabled={
                                    !replyText.trim() || commentSubmitting
                                  }
                                  className="bg-primary hover:bg-primary/80 text-white"
                                >
                                  {commentSubmitting ? "Replying..." : "Reply"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-4 mt-4 border-l-2 border-zinc-700 space-y-4">
                          {comment.replies.map((reply, replyIndex) => (
                            <div key={replyIndex} className="mt-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={reply.profile_picture}
                                    alt={reply.username}
                                  />
                                  <AvatarFallback className="bg-primary/20 text-white text-xs">
                                    {reply.username?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-medium text-sm text-white">
                                      {reply.username}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300 whitespace-pre-line">
                                    {reply.text}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs mt-1 text-gray-300 hover:bg-zinc-700"
                                  >
                                    <ThumbsUp size={12} className="mr-1" />
                                    Like
                                  </Button>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
