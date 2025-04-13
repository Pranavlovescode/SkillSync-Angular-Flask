import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Heart, HeartOff, LucideAngularModule, MessageCircle, Reply } from 'lucide-angular';
import { environment } from '../../../environments/environment.development';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: string;
  text: string;
  user_id: any;
  username: string;
  profile_picture: string;
  created_at?: {
    $date: Date;
  };
  parent_id: string | null;
  replies: Comment[];
}

interface SkillPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  liked_by: any[];
  comments?: Comment[];
  image: string;
  video: string;
  created_at?: {
    $date: Date;
  };
}

interface User {
  _id: {
    $oid: string;
  };
  username: string;
  profile_picture: string;
}

interface Post {
  skillpost?: SkillPost;
  user?: User;
  current_user?: User;
  user_has_liked?: boolean;
}

@Component({
  selector: 'app-skillpost-details',
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './skillpost-details.component.html',
  styleUrl: './skillpost-details.component.css',
})
export class SkillpostDetailsComponent implements OnInit {
  postId: string | null = null;
  post: Post | null = null;
  loading = true;
  error = false;
  showComments = false;
  newComment: string = '';
  replyCommentId: string | null = null;
  replyText: string = '';
  
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
  readonly Heart = Heart;
  readonly HeartOff = HeartOff;
  readonly MessageCircle = MessageCircle;
  readonly Reply = Reply;
  apiUrl: string = environment.base_url;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('postId');
      if (this.postId) {
        this.fetchPost(this.postId);
      }
    });
  }

  fetchPost(id: string): void {
    this.loading = true;
    this.error = false;

    this.getPost(id).subscribe({
      next: (res) => {
        this.post = res;
        this.loading = false;
        console.log('The skill post is ', res);
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/skillpost/get-by-id/${id}`, {
      withCredentials: true,
    });
  }

  likePost(): void {
    if (!this.postId) return;

    this.http.post(`${this.apiUrl}/skillpost/like/${this.postId}`, {}, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          if (this.post && this.post.skillpost) {
            this.post.skillpost.likes = res.likes;
            this.post.user_has_liked = res.liked;
          }
        },
        error: (err) => {
          console.error('Error toggling like:', err);
        }
      });
  }

  toggleCommentSection(): void {
    this.showComments = !this.showComments;
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.postId) return;

    this.http.post(`${this.apiUrl}/skillpost/comment/${this.postId}`, 
      { comment: this.newComment }, 
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        if (this.post && this.post.skillpost) {
          this.post.skillpost.comments = res.comments;
          this.newComment = ''; // Clear the input field
        }
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });
  }

  replyToComment(commentId: string): void {
    this.replyCommentId = commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyCommentId = null;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.replyText.trim() || !this.postId || !this.replyCommentId) return;

    this.http.post(`${this.apiUrl}/skillpost/comment/${this.postId}`, 
      { 
        comment: this.replyText,
        parent_id: this.replyCommentId 
      }, 
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        if (this.post && this.post.skillpost) {
          this.post.skillpost.comments = res.comments;
          this.replyCommentId = null;
          this.replyText = '';
        }
      },
      error: (err) => {
        console.error('Error adding reply:', err);
      }
    });
  }

  formatDate(dateString: any): string {
    if (!dateString) return '';
    
    const date = new Date(dateString.$date || dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isCurrentUser(userId: any): boolean {
    if (!this.post || !this.post.current_user) return false;
    return String(userId) === String(this.post.current_user._id.$oid || this.post.current_user._id);
  }
}
