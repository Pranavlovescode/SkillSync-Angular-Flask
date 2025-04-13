import { NgFor, NgIf, DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  Heart,
  MessageCircle,
  Send,
} from 'lucide-angular';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare const _NGX_ENV_: any;

interface Comment {
  user: {
    username: string;
    profile_picture: string;
  };
  text: string;
  timestamp: string;
}

interface SkillPost {
  _id: {
    $oid: string;
  };
  title: string;
  user: {
    username: string;
    profile_picture: string;
  };
  description: string;
  tags: string[];
  likes: number;
  liked_by: (string | { $oid: string })[]; // Array of user IDs or objects with $oid
  comments: Comment[];
  image: string;
  video: string;
  showComments?: boolean; // UI state property
  newComment?: string; // UI state property
  isLiked?: boolean; // UI state to track if current user has liked this post
}

@Component({
  selector: 'app-skillposts',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    LucideAngularModule,
    NavbarComponent,
    RouterLink,
    FormsModule,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './skillposts.component.html',
  styleUrl: './skillposts.component.css',
})
export class SkillpostsComponent implements OnInit {
  apiUrl: string = environment.base_url;
  JSON: JSON = JSON;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Cookie ', document.cookie);
    // First fetch user info, then fetch posts
    this.getCurrentUser();
  }

  skillPost: SkillPost[] = [];
  currentUserId: string = '';

  fetchAllPosts() {
    this.http
      .get(`${this.apiUrl}/skillpost/get-all`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('The response is ', res);
          this.skillPost = res as SkillPost[];

          // Initialize UI state properties
          this.skillPost.forEach((post) => {
            post.showComments = false;
            post.newComment = '';
            if (!post.comments) post.comments = [];
            if (!post.liked_by) post.liked_by = [];

            // Set the isLiked flag based on if current user is in the liked_by array
            post.isLiked = this.isPostLikedByCurrentUser(post);
          });
        },
        error: (err) => {
          console.log('Error while fetching posts', err);
        },
      });
  }

  getCurrentUser() {
    this.http
      .get(`${this.apiUrl}/auth/current-user`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          if (res && res._id && res._id.$oid) {
            this.currentUserId = res._id.$oid;
            this.currentUser.name = res.name || this.currentUser.name;
            this.currentUser.username =
              res.username || this.currentUser.username;
            this.currentUser.avatarUrl =
              res.profile_picture || this.currentUser.avatarUrl;

            console.log('Current user ID:', this.currentUserId);

            // Now that we have the user ID, fetch posts
            this.fetchAllPosts();
            // this.fetchComments(this.skillPost[0]); // Fetch comments for the first post as an example
          }
        },
        error: (err) => {
          console.log('Error fetching current user', err);
          // Still try to fetch posts even if user info fails
          this.fetchAllPosts();
        },
      });
  }

  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;

  currentUser = {
    name: 'John Doe',
    username: 'john_doe',
    avatarUrl:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png',
  };

  isPostLikedByCurrentUser(post: SkillPost): boolean {
    // First check the isLiked flag if it exists
    if (post.isLiked !== undefined) return post.isLiked;

    // Otherwise check if user ID is in the liked_by array
    if (!post.liked_by || !Array.isArray(post.liked_by)) return false;

    // Check if liked_by contains the current user ID
    for (const likedById of post.liked_by) {
      // Handle both string IDs and objects with $oid
      if (typeof likedById === 'string' && likedById === this.currentUserId)
        return true;
      if (
        typeof likedById === 'object' &&
        '$oid' in likedById &&
        (likedById as { $oid: string }).$oid === this.currentUserId
      )
        return true;
    }

    return false;
  }

  likePost(post: SkillPost) {
    console.log('Liking post', post._id.$oid);

    this.http
      .post(
        `${this.apiUrl}/skillpost/like/${post._id.$oid}`,
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (res: any) => {
          console.log('Like response:', res);

          // Toggle the like state
          post.isLiked = !post.isLiked;

          // Update the likes count and liked_by array based on server response
          if (res && typeof res.likes === 'number') {
            post.likes = res.likes;
          } else {
            // If server doesn't provide likes count, update locally
            if (post.isLiked) {
              post.likes = (post.likes || 0) + 1;
              if (!post.liked_by) post.liked_by = [];
              post.liked_by.push(this.currentUserId);
            } else {
              post.likes = Math.max(0, (post.likes || 1) - 1);
              if (post.liked_by) {
                post.liked_by = post.liked_by.filter((id) => {
                  if (typeof id === 'string') return id !== this.currentUserId;
                  if (typeof id === 'object' && '$oid' in id)
                    return id.$oid !== this.currentUserId;
                  return true;
                });
              }
            }
          }
        },
        error: (err) => {
          console.error('Error liking post:', err);
          alert('Failed to like post. Please try again.');
        },
      });
  }

  toggleComments(post: SkillPost) {
    post.showComments = !post.showComments;
    console.log('Toggling comments for post');
    // If opening comments and they haven't been loaded yet, fetch them
    if (post.showComments && (!post.comments || post.comments.length === 0)) {
      this.fetchComments(post);
    }
  }

  fetchComments(post: SkillPost) {
    console.log('Fetching comments for post', post._id.$oid);

    this.http
      .get(`${this.apiUrl}/skillpost/comments/${post._id.$oid}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          console.log('Comments response:', res);
          
          // Simply use the comments array as-is from the backend
          if (Array.isArray(res)) {
            post.comments = res;
          } else if (res && res.comments && Array.isArray(res.comments)) {
            post.comments = res.comments;
          } else {
            // Initialize with empty array if no comments returned
            post.comments = [];
          }
          
          console.log("Comments stored:", post.comments);
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
          post.comments = []; // Set empty array on error
        },
      });
  }

  addComment(post: SkillPost) {
    if (!post.newComment || post.newComment.trim() === '') return;

    console.log('Adding comment to post', post._id.$oid, post.newComment);

    this.http
      .post(
        `${this.apiUrl}/skillpost/comment/${post._id.$oid}`,
        {
          comment: post.newComment, // Using 'comment' to match backend parameter name
        },
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (res: any) => {
          console.log('Add comment response:', res);

          // Use the comments directly from the server response
          if (res && res.comments && Array.isArray(res.comments)) {
            post.comments = res.comments;
          } else {
            // If server doesn't return the full comments array, add locally
            if (!post.comments) post.comments = [];
            
            // Add a new comment in the format that matches our backend
            const newComment:Comment = {
              text: post.newComment || '', 
              user:{username: this.currentUser.username,
              profile_picture: this.currentUser.avatarUrl},
              timestamp: new Date().toISOString(),
              // replies: []
            };
            
            post.comments.push(newComment);
          }
          
          post.newComment = ''; // Clear the input field
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          alert('Failed to add comment. Please try again.');
        },
      });
  }
}
