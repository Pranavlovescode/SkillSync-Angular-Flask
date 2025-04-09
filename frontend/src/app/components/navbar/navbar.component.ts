import { Component } from '@angular/core';
import {LucideAngularModule,Search,Home} from 'lucide-angular'; 
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


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
  selector: 'app-navbar',
  imports: [LucideAngularModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})



export class NavbarComponent {
  readonly Search = Search;
  readonly home = Home;
  apiUrl:string = environment.base_url;

  constructor(private http: HttpClient) {}
  logout() {
    this.http.get(`${this.apiUrl}/auth/logout`,{
      withCredentials: true
    }).subscribe((res) => {
      console.log('The response is ', res);
      window.location.href = '/';
    }, (err) => {
      console.log('Error while logging out', err);
    });
  }

  getUser(){
    this.http.get(`${this.apiUrl}/auth/get-profile`,{
      withCredentials: true
    }).subscribe((res) => {
      console.log('The response is ', res);
      this.currentUser = res as UserProfile;
    }, (err) => {
      console.log('Error while fetching user', err);
    });

  }


  currentUser:UserProfile | null = null;


  ngOnInit() {
    this.getUser();
    console.log('Cookie ', document.cookie);
  }


}
