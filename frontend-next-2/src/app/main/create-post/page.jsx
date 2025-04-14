"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  PlusCircle,
  Image,
  Video,
  X,
  Loader2,
  Tags,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { skillPostService } from "@/services/skillPostService";

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    image: null,
    video: null,
  });
  const [tags, setTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for development
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
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
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));

      // Create preview
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }));
    setVideoPreview(null);
  };

  const addTag = () => {
    if (formData.tag && !tags.includes(formData.tag)) {
      setTags([...tags, formData.tag]);
      setFormData((prev) => ({
        ...prev,
        tag: "",
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && formData.tag) {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);

      // Add tags
      tags.forEach((tag) => {
        postData.append("tags", tag);
      });

      // Add media files if they exist
      if (formData.image) {
        postData.append("image", formData.image);
      }

      if (formData.video) {
        postData.append("video", formData.video);
      }

      await skillPostService.createPost(postData);
      setShowSuccessAlert(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        tag: "",
        image: null,
        video: null,
      });
      setTags([]);
      setImagePreview(null);
      setVideoPreview(null);

      // Show success alert for 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        router.push("/main");
      }, 5000);
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] ">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="w-full min-h-screen bg-zinc-800">
        <div className="container mx-auto p-4 max-w-3xl mt-6">
          {showSuccessAlert && (
            <Alert
              variant="success"
              className="mb-6 bg-green-50 text-green-800 border-green-200"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <AlertTitle>Success!</AlertTitle>
              </div>
              <AlertDescription>
                Your post has been created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="border-zinc-700 bg-zinc-900 text-zinc-100 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-white">
                Create a New Post
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Share your skills, knowledge, or ask for help from the community
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-300">
                    Post Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a catchy title for your post"
                    className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                    required
                  />
                  {formData.title === "" && (
                    <p className="text-xs text-red-400 mt-1">
                      Title is required
                    </p>
                  )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Share your thoughts, experiences, or questions..."
                    className="min-h-[150px] bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                    required
                  />
                  {formData.description === "" && (
                    <p className="text-xs text-red-400 mt-1">
                      Description is required
                    </p>
                  )}
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <Tags size={16} />
                    <span>Tags</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      name="tag"
                      value={formData.tag}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Add relevant tags (press Enter to add)"
                      className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="shrink-0"
                      variant="outline"
                      size="icon"
                    >
                      <PlusCircle className="text-black" size={20} />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 px-2 py-1"
                      >
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 p-0 text-blue-300 hover:text-blue-100 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X size={14} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Media Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="text-zinc-300 flex items-center gap-2"
                    >
                      <Image size={16} />
                      <span>Image</span>
                    </Label>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-md p-4 flex flex-col items-center justify-center gap-2">
                      {imagePreview ? (
                        <div className="w-full space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto max-h-[200px] object-contain rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="w-full"
                          >
                            <X size={16} className="mr-1" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="w-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-6 gap-2 border-2 border-dashed border-zinc-700 rounded-md hover:border-zinc-500 transition-colors">
                            <Image size={30} className="text-zinc-500" />
                            <p className="text-sm text-zinc-400">
                              Click to upload image
                            </p>
                          </div>
                          <input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="video"
                      className="text-zinc-300 flex items-center gap-2"
                    >
                      <Video size={16} />
                      <span>Video</span>
                    </Label>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-md p-4 flex flex-col items-center justify-center gap-2">
                      {videoPreview ? (
                        <div className="w-full space-y-3">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-auto max-h-[200px] rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeVideo}
                            className="w-full"
                          >
                            <X size={16} className="mr-1" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="w-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-6 gap-2 border-2 border-dashed border-zinc-700 rounded-md hover:border-zinc-500 transition-colors">
                            <Video size={30} className="text-zinc-500" />
                            <p className="text-sm text-zinc-400">
                              Click to upload video
                            </p>
                          </div>
                          <input
                            id="video"
                            type="file"
                            onChange={handleVideoChange}
                            accept="video/*"
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end pt-3">
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.title || !formData.description}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
