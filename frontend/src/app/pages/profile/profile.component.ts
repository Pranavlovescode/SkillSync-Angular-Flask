import { NgFor, NgForOf, NgIf, ɵparseCookieValue } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cookie, Linkedin, LucideAngularModule, Pen } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  first_name: string;
  last_name: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  joined_on: {
    $date: Date;
  };
  website: string;
  skills: Skill[];
  stats: UserStats;
  skillposts: Post[];
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
  _id: string;
  title: string;
  tags: string[];
  user:string,
  description:string,
  created_at:{
    $date:Date,
  },
  is_active:boolean,
  is_deleted:boolean,
  video:string,
  image:string,
  likes:number,
}

@Component({
  selector: 'app-profile',
  imports: [NgFor, NgForOf, RouterLink, NavbarComponent, LucideAngularModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly Pen = Pen;
  apiUrl: string = environment.base_url;
  JSON: JSON = JSON;
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.fetchProfile();
    console.log('Cookie ', document.cookie);

  }

  fetchProfile() {
    this.http.get<UserProfile>(`${this.apiUrl}/auth/get-profile`, {
      withCredentials: true,
    }).subscribe((res) => {
      console.log('The response is ', res);
      this.profile = res;
      this.profile.skillposts = res.skillposts
      console.log('The profile is ', this.profile);
      console.log('The skillposts are ', this.profile.skillposts);
      console.log('The skillposts are ', this.profile.skillposts[0].title);
    }, (err) => { 
      console.log('Error while fetching profile', err);
    });
  }


  

  // profile: UserProfile = {
  //   first_name: 'John',
  //   last_name: 'Doe',
  //   username: 'john_doe',
  //   avatarUrl:
  //     'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png',
  //   coverUrl: '/assets/cover.jpg',
  //   bio: 'Senior Angular Developer | Open Source Contributor | Tech Enthusiast',
  //   location: 'San Francisco, CA',
  //   joinDate: new Date('2022-01-01'),
  //   website: 'https://johndoe.dev',
  //   skills: [
  //     { name: 'Angular', level: 5, endorsements: 42 },
  //     { name: 'TypeScript', level: 4, endorsements: 38 },
  //     { name: 'RxJS', level: 4, endorsements: 27 },
  //     { name: 'Node.js', level: 3, endorsements: 31 },
  //     { name: 'MongoDB', level: 3, endorsements: 25 },
  //   ],
  //   stats: {
  //     posts: 156,
  //     followers: 1234,
  //     following: 567,
  //     totalLikes: 2891,
  //   },
  //   skillposts: [{
  //     _id: '1',
  //     title:
  //       'Just published a new article about Angular Signals! Check it out on my blog.',
  //     created_at: new Date('2024-02-22'),
  //     // likes: 45,
  //     tags: ['angular', 'webdev'],
  //     user: '1',
  //     description: 'Description',
  //     is_active: true,
  //     is_deleted: false,
  //     video: 'video',
  //     image: 'image'
  //   }],
  //   // skillposts: [
  //   //   {
  //   //     _id: '1',
  //   //     title:
  //   //       'Just published a new article about Angular Signals! Check it out on my blog.',
  //   //     created_at: new Date('2024-02-22'),
  //   //     // likes: 45,
  //   //     tags: ['angular', 'webdev'],
  //   //   },
  //   //   {
  //   //     _id: '2',
  //   //     title:
  //   //       'Excited to share my latest project using Angular and Three.js!',
  //   //     date: new Date('2024-02-20'),
  //   //     likes: 32,
  //   //     tags: ['angular', 'threejs'],
  //   //   },
  //   // ],
  // };

  profile :UserProfile | null = null;

  getSkillLevelClass(level: number): string {
    return `progress-${level * 20}`;
  }

  endorseSkill(skill: Skill): void {
    skill.endorsements++;
  }

  formatDate(date: Date): string {
    return new Date(date).toDateString();
  }
}
