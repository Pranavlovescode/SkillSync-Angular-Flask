"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { skillPostService } from "@/services/skillPostService";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likeInProgress, setLikeInProgress] = useState({});
  const [likeAnimation, setLikeAnimation] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await skillPostService.getAllPosts();
        if (!data) {
          console.log("posts not found");
          setError("No posts found");
        }
        console.log("posts data", data);
        setPosts(data || []);
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
      setLikeInProgress((prev) => ({ ...prev, [postId]: true }));

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id.$oid === postId) {
            const isCurrentlyLiked = post.liked_by_user;
            return {
              ...post,
              liked_by_user: !isCurrentlyLiked,
              likes: isCurrentlyLiked
                ? Math.max(0, (post.likes || 1) - 1)
                : (post.likes || 0) + 1,
            };
          }
          return post;
        })
      );

      setLikeAnimation((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setLikeAnimation((prev) => ({ ...prev, [postId]: false }));
      }, 1000);

      const response = await skillPostService.likePost(postId);
      console.log("Like response", response);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id.$oid === postId
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
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id.$oid === postId) {
            const isCurrentlyLiked = post.liked_by_user;
            return {
              ...post,
              liked_by_user: !isCurrentlyLiked,
              likes: isCurrentlyLiked
                ? (post.likes || 0) + 1
                : Math.max(0, (post.likes || 1) - 1),
            };
          }
          return post;
        })
      );
    } finally {
      setLikeInProgress((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date format");

      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return "Invalid date";
    }
  };

  const renderLoading = () => (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-card/30 backdrop-blur border-muted">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full rounded-md mt-2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="bg-zinc-800 min-h-screen dark text-foreground py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500  text-transparent mb-2">
            Skill<span className="text-primary">Sync</span>
          </h1>
          <p className="text-muted-foreground">
            Discover and share amazing skills with the community
          </p>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full mb-8"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-zinc-900">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Latest Skills</h2>
              <Link href="/main/create-post">
                <Button className="bg-zinc-900 hover:bg-zinc-600 duration-300 text-purple-400 border-purple-600 transition-all">
                  Share Your Skill
                </Button>
              </Link>
            </div>

            {loading && renderLoading()}

            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-12 border border-dashed rounded-xl border-muted-foreground/30 bg-card/30 backdrop-blur max-w-2xl mx-auto">
                <div className="mb-4 text-5xl">✨</div>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your amazing skills with the community!
                </p>
                <Link href="/main/create-post">
                  <Button
                    variant="gradient"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  >
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {!loading &&
                !error &&
                posts.map((post) => (
                  <Card
                    key={post._id.$oid}
                    className="bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] backdrop-blur border-muted max-w-2xl mx-auto"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/main/profile/${post?.user?.username}`}>
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                            <AvatarImage
                              src={
                                post.user?.profile_picture ||
                                `${post.user?.first_name?.charAt(0) || ""}${
                                  post.user?.last_name?.charAt(0) || ""
                                }`
                              }
                              alt={post?.user?.username || "User"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-white">
                              {(post?.user?.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link
                                href={`/main/profile/${post?.user?.username}`}
                              >
                                <span className="font-medium hover:text-primary transition-colors">
                                  {post?.user?.username || "Anonymous"}
                                </span>
                              </Link>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(post.created_at.$date)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <BookmarkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <Link href={`/main/posts/${post._id.$oid}`}>
                        <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>

                      {(() => {
                        const content = post.content || post.description || "";
                        const maxLength = 100;
                        const needsReadMore = content.length > maxLength;
                        const isExpanded = expandedPosts[post._id?.$oid];

                        return (
                          <div className="text-muted-foreground">
                            <p>
                              {needsReadMore && !isExpanded
                                ? `${content.substring(0, maxLength)}...`
                                : content}
                            </p>

                            {needsReadMore && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleReadMore(post._id?.$oid);
                                }}
                                className="text-primary hover:text-purple-500 hover:cursor-pointer text-sm mt-1 font-medium"
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {post.image && (
                        <div className="mt-4 rounded-md overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full object-cover hover:scale-[1.02] transition-transform"
                          />
                        </div>
                      )}

                      {post.video && !post.image && (
                        <div className="mt-4 rounded-md overflow-hidden">
                          <video src={post.video} className="w-full" controls>
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </CardContent>

                    <Separator />

                    <CardFooter className="py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 relative overflow-visible`}
                            onClick={() =>                              
                              handleLike(post._id.$oid)
                            }
                            // disabled={likeInProgress[post._id.$oid]}
                          >
                          
                            {post.liked_by_user ? (
                              <Heart
                                size={20}
                                className={'text-red-500'}
                              />
                            ) : (
                              <Heart
                                size={20}                                
                              />
                            )}
                            <span
                              
                            >
                              {post.likes || 0}
                            </span>
                          </Button>

                          <Link href={`/main/posts/${post._id.$oid}`}>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <MessageCircle size={20} />
                              {post.comments?.length || 0}
                            </Button>
                          </Link>
                        </div>

                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 size={18} />
                          Share
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                Trending skills coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                Follow your favorite creators to see their content here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
