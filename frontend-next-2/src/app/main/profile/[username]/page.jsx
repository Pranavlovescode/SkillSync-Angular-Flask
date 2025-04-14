"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { skillPostService } from "@/services/skillPostService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Pen,
  MapPin,
  Globe,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Heart,
  Plus,
  User,
  Settings,
  Briefcase,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { username } = useParams();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      console.log(username);
      const userData = await authService.getProfile(username);

      if (userData) {
        console.log("profile data fetched successfully", userData);
        setProfile(userData);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOwnProfile = () => {
    const currentUser = authService.getCurrentUser();
    return (
      currentUser &&
      (currentUser.username === username)
    );
  };

  const endorseSkill = (skill) => {
    console.log("Endorsed skill:", skill);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-800 text-zinc-100 pt-16">
        <div className="container mx-auto px-4">
          <div className="h-48 md:h-72 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-b-lg animate-pulse"></div>
          <div className="relative -mt-20 sm:-mt-24">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || profile=={}) {
    return (
      <div className="min-h-screen bg-zinc-800 text-zinc-100 flex items-center justify-center">
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">{error || "Profile not found"}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/main")}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const initials = `${profile.first_name?.charAt(0) || ""}${
    profile.last_name?.charAt(0) || ""
  }`;

  return (
    <div className="min-h-screen bg-zinc-800 text-zinc-100">
      {/* Cover Photo and Profile Info */}
      <div className="relative container mx-auto px-4 pt-16">
        <div className="h-48 md:h-72 rounded-b-lg bg-gradient-to-r from-blue-600/40 to-purple-600/40 overflow-hidden">
          {/* Optional: Add a pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-20 sm:-mt-24">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-zinc-950 shadow-xl">
                {profile.profile_picture ? (
                  <AvatarImage
                    src={profile.profile_picture}
                    alt={`${profile.first_name}'s profile picture`}
                  />
                ) : (
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Basic Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-zinc-400">@{profile.username}</p>
                {profile.bio ? (
                  <p className="mt-2 text-sm sm:text-base text-zinc-300">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-2 text-sm sm:text-base text-zinc-500 italic">
                    No bio available
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:mt-24">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-colors">
                  <User className="mr-2 h-4 w-4 text-white" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-700 hover:bg-zinc-800 hover:text-gray-200 hover:border-blue-500 transition-all"
                >
                  <MessageSquare className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-400" />
                  Message
                </Button>
              </div>
            </div>

            {/* Edit profile button */}
            {isOwnProfile() && (
              <Link href="/main/profile/edit">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full absolute top-6 right-3 bg-zinc-800/50 border-zinc-700 hover:bg-blue-900/30 hover:border-blue-600 transition-all"
                >
                  <Pen className="h-4 w-4 text-white" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Details Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-blue-900/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-zinc-100">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-300 group">
                  <MapPin className="h-5 w-5 text-white group-hover:text-blue-400 transition-colors" />
                  {profile.location ? (
                    <span className="group-hover:text-blue-300 transition-colors">
                      {profile.location}
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-sm">
                      Location not specified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-300 group">
                  <Globe className="h-5 w-5 text-white group-hover:text-purple-400 transition-colors" />
                  {profile.website ? (
                    <a
                      href={`/${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-zinc-500 text-sm">
                      Website not specified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-zinc-300 group">
                  <Calendar className="h-5 w-5 text-white group-hover:text-green-400 transition-colors" />
                  {profile.joined_on ? (
                    <span className="group-hover:text-green-300 transition-colors">
                      Joined{" "}
                      {formatDate(profile.joined_on.$date || profile.joined_on)}
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-sm">
                      Join date unknown
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden hover:border-purple-900/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-zinc-100">
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="space-y-3">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-white group-hover:text-purple-400 transition-colors" />
                            <span className="font-medium text-zinc-200 group-hover:text-purple-300 transition-colors">
                              {typeof skill === "string" ? skill : skill.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:text-blue-400 hover:bg-zinc-800 group"
                            onClick={() => endorseSkill(skill)}
                          >
                            <ThumbsUp className="h-4 w-4 text-white group-hover:text-blue-400 transition-colors" />
                            <span className="text-xs text-white group-hover:text-blue-400 transition-colors">
                              {typeof skill === "object"
                                ? skill.endorsements || 0
                                : 0}
                            </span>
                          </Button>
                        </div>
                        {index < profile.skills.length - 1 && (
                          <Separator className="bg-zinc-800" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    No skills found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden hover:border-green-900/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-zinc-100">
                    Recent Posts
                  </CardTitle>
                  <Link href="/main/create-post">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-white hover:bg-zinc-800 hover:text-green-400 transition-colors group"
                    >
                      <Plus className="h-4 w-4 text-white group-hover:text-green-400 transition-colors" />
                      <span>Create</span>
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {profile.skillposts && profile.skillposts.length > 0 ? (
                  <div className="space-y-4">
                    {profile.skillposts.map((post) => {
                      const postId = post._id?.$oid || post.id;
                      return (
                        <div key={postId || index} className="group">
                          <Link href={postId ? `/main/posts/${postId}` : "#"}>
                            <div className="flex flex-col space-y-2 p-3 rounded-md hover:bg-zinc-800/50 transition-colors">
                              <h3 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">
                                {post.title}
                              </h3>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {post.tags &&
                                    post.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="bg-blue-950/30 text-blue-300 border-blue-800 hover:bg-blue-900/40 hover:border-blue-600 transition-all"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                                <span className="group-hover:text-zinc-300 transition-colors">
                                  {formatDate(
                                    post.created_at?.$date || post.created_at
                                  )}
                                </span>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                                    <MessageSquare className="h-3 w-3 text-white group-hover:text-blue-400 transition-colors" />
                                    <span>{post.comments?.length || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-3 w-3 text-red-500 group-hover:text-red-400 transition-colors" />
                                    <span className="group-hover:text-red-400 transition-colors">
                                      {post.likes || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          {post !==
                            profile.skillposts[
                              profile.skillposts.length - 1
                            ] && <Separator className="bg-zinc-800 my-2" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    No posts found
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main content column - you can add activity feed, projects, etc. here */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-blue-900/30 transition-all">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100">
                  Activity Feed
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Recent activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-zinc-800">
                  {/* Placeholder activity items */}
                  <div className="relative group">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors"></div>
                    <div className="text-sm">
                      <p className="font-medium text-zinc-200 group-hover:text-blue-300 transition-colors">
                        Started following{" "}
                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                          @sarah_designs
                        </span>
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">2 days ago</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-purple-500 group-hover:bg-purple-400 transition-colors"></div>
                    <div className="text-sm">
                      <p className="font-medium text-zinc-200 group-hover:text-purple-300 transition-colors">
                        Posted a new skillpost:{" "}
                        <span className="text-blue-400 group-hover:text-purple-300 transition-colors">
                          Building a responsive portfolio with TailwindCSS
                        </span>
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">5 days ago</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-green-500 group-hover:bg-green-400 transition-colors"></div>
                    <div className="text-sm">
                      <p className="font-medium text-zinc-200 group-hover:text-green-300 transition-colors">
                        Added a new skill:{" "}
                        <span className="text-blue-400 group-hover:text-green-300 transition-colors">
                          React Native
                        </span>
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects/Showcase section */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg hover:border-purple-900/30 transition-all">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100">
                  Portfolio
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Projects and work samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder project cards */}
                  <Card className="bg-zinc-800 border-zinc-700 hover:border-blue-700 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-md bg-zinc-700 mb-3 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-purple-600/40 transition-all">
                          <span className="text-zinc-400 group-hover:text-white transition-colors">
                            Project Image
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">
                        E-Commerce Dashboard
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 group-hover:text-zinc-300 transition-colors">
                        A powerful admin dashboard built with React and Redux
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-purple-700 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-md bg-zinc-700 mb-3 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center group-hover:from-purple-500/40 group-hover:to-pink-600/40 transition-all">
                          <span className="text-zinc-400 group-hover:text-white transition-colors">
                            Project Image
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium text-zinc-200 group-hover:text-purple-400 transition-colors">
                        Weather App
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 group-hover:text-zinc-300 transition-colors">
                        Mobile weather application using OpenWeather API
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="bg-zinc-800 text-purple-400 border-purple-600 transition-all"
                  >
                    View All Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
