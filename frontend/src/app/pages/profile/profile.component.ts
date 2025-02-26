import { NgFor, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Linkedin } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  joinDate: Date;
  website: string;
  skills: Skill[];
  stats: UserStats;
  recentPosts: Post[];
}

interface Skill {
  name: string;
  level: number;
  endorsements: number;
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
  totalLikes: number;
}

interface Post {
  id: number;
  content: string;
  date: Date;
  likes: number;
  tags: string[];
}

@Component({
  selector: 'app-profile',
  imports: [NgFor, NgForOf,RouterLink,NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profile: UserProfile = {
    name: 'John Doe',
    username: 'john_doe',
    avatarUrl:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png',
    coverUrl: '/assets/cover.jpg',
    bio: 'Senior Angular Developer | Open Source Contributor | Tech Enthusiast',
    location: 'San Francisco, CA',
    joinDate: new Date('2022-01-01'),
    website: 'https://johndoe.dev',
    skills: [
      { name: 'Angular', level: 5, endorsements: 42 },
      { name: 'TypeScript', level: 4, endorsements: 38 },
      { name: 'RxJS', level: 4, endorsements: 27 },
      { name: 'Node.js', level: 3, endorsements: 31 },
      { name: 'MongoDB', level: 3, endorsements: 25 },
    ],
    stats: {
      posts: 156,
      followers: 1234,
      following: 567,
      totalLikes: 2891,
    },
    recentPosts: [
      {
        id: 1,
        content:
          'Just published a new article about Angular Signals! Check it out on my blog.',
        date: new Date('2024-02-22'),
        likes: 45,
        tags: ['angular', 'webdev'],
      },
      {
        id: 2,
        content:
          'Excited to share my latest project using Angular and Three.js!',
        date: new Date('2024-02-20'),
        likes: 32,
        tags: ['angular', 'threejs'],
      },
    ],
  };

  getSkillLevelClass(level: number): string {
    return `progress-${level * 20}`;
  }

  endorseSkill(skill: Skill): void {
    skill.endorsements++;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
