'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { skillPostService } from '@/services/skillPostService';
import { Pen } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

export default function ProfilePage({ params }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = params;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authService.getProfile(id);
        setProfile(userData.user);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toDateString();
  };

  const isOwnProfile = () => {
    const currentUser = authService.getCurrentUser();
    return currentUser && (currentUser.id.toString() === id.toString() || currentUser.username === id);
  };

  const endorseSkill = (skill) => {
    // Implement skill endorsement functionality
    console.log('Endorsed skill:', skill);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="alert alert-error max-w-2xl mx-auto my-8">
          <span>{error || 'Profile not found'}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200">
        {/* Cover Photo and Profile Info */}
        <div className="relative container mx-auto px-4">
          <div className="h-48 md:h-72 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="container mx-auto px-4">
            <div className="relative -mt-20 sm:-mt-24">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {profile.profile_picture ? (
                      <img src={profile.profile_picture} alt="Profile picture" />
                    ) : (
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        alt="Profile picture"
                      />
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-base-content/60 text-gray-900">
                    {profile.username}
                  </p>
                  {profile.bio ? (
                    <p className="mt-2 text-sm sm:text-base">{profile.bio}</p>
                  ) : (
                    <p className="mt-2 text-sm sm:text-base text-base-content/60">
                      No bio available
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 md:mt-24">
                  <button className="btn btn-primary">Follow</button>
                  <button className="btn btn-outline">Message</button>
                </div>
              </div>
              
              {/* Edit profile button */}
              {isOwnProfile() && (
                <Link
                  href="/main/profile/edit"
                  className="btn btn-neutral rounded-full absolute top-6 right-3"
                  legacyBehavior>
                  <Pen className="h-5 w-5" />
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
              <div className="card bg-neutral shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-base-content/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {profile.location ? (
                        <span>{profile.location}</span>
                      ) : (
                        <span className="text-base-content/60 text-sm">N.A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-base-content/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className="text-base-content/60 text-sm">N.A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-base-content/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {profile.joined_on ? (
                        <span>Joined {formatDate(profile.joined_on.$date || profile.joined_on)}</span>
                      ) : (
                        <span>N.A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              {profile.skills && profile.skills.length > 0 ? (
                <div className="card bg-neutral shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">Skills & Expertise</h2>
                    <div className="space-y-4">
                      {profile.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{typeof skill === 'string' ? skill : skill.name}</span>
                            <button
                              className="btn btn-sm btn-ghost gap-2"
                              onClick={() => endorseSkill(skill)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              {typeof skill === 'object' ? skill.endorsements || 0 : 0}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card bg-neutral shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">Skills & Expertise</h2>
                    <p className="text-sm text-base-content/60 text-center">
                      No skills found
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              <div className="card bg-neutral shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title">Recent Posts</h2>
                    <Link href="/main/create-post" className="btn bg-base-200 btn-sm">
                      Create Post
                    </Link>
                  </div>
                  
                  {profile.skillposts && profile.skillposts.length > 0 ? (
                    <div className="space-y-4">
                      {profile.skillposts.map((post) => (
                        <div
                          key={post._id.$oid || post.id}
                          className="border-b last:border-0 pb-4 last:pb-0"
                        >
                          <Link
                            href={`/main/posts/${post._id.$oid || post.id}`}
                            className="flex flex-col"
                            legacyBehavior>
                            <p className="mb-2">{post.title}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {post.tags && post.tags.map((tag) => (
                                  <div
                                    key={tag}
                                    className="badge badge-primary"
                                  >
                                    {tag}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-base-content/60">
                                  {formatDate(post.created_at.$date || post.created_at)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                  <span>{post.likes || 0}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60 text-center">No posts found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}