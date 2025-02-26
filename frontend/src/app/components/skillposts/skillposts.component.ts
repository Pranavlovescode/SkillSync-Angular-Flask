import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule,Heart } from 'lucide-angular';
import { NavbarComponent } from '../navbar/navbar.component';

interface SkillPost {
  id: number;
  author: string;
  username: string;
  content: string;
  tags: string[];
  likes: number;
  avatarUrl: string;
}

@Component({
  selector: 'app-skillposts',
  imports: [NgFor,LucideAngularModule,NavbarComponent],
  templateUrl: './skillposts.component.html',
  styleUrl: './skillposts.component.css'
})
export class SkillpostsComponent {
  readonly Heart = Heart;
  currentUser = {
    name: 'John Doe',
    username: 'john_doe',
    avatarUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png'
  };

  skillPosts: SkillPost[] = [
    {
      id: 1,
      author: 'John Doe',
      username: 'john_doe',
      content: 'Just mastered Angular Signals! A game-changer for state management in Angular applications. Looking forward to implementing this in my next project! 🚀',
      tags: ['angular-learner'],
      likes: 5,
      avatarUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png'
    },
    {
      id: 2,
      author: 'John Doe',
      username: 'john_doe',
      content: 'Deep diving into Angular Server Side Rendering with Angular Universal. The performance improvements are incredible! 💻',
      tags: ['angular-advanced'],
      likes: 3,
      avatarUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png'
    }
  ];
post: any;
tag: any;

  createPost(content: string) {
    if (content.trim()) {
      const newPost: SkillPost = {
        id: this.skillPosts.length + 1,
        author: this.currentUser.name,
        username: this.currentUser.username,
        content: content,
        tags: ['angular-learner'],
        likes: 0,
        avatarUrl: this.currentUser.avatarUrl
      };
      this.skillPosts.unshift(newPost);
    }
  }

  likePost(post: SkillPost) {
    post.likes++;
  }
}
