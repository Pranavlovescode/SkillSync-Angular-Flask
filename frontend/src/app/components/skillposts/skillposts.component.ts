import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule,Heart } from 'lucide-angular';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

declare const _NGX_ENV_: any;

interface SkillPost {
  id: string;
  title: string;
  user: {
    username: string;
  };
  description: string;
  tags: string[];
  likes: number;
  comments:string[];
  image: string;
  video: string;
}


@Component({
  selector: 'app-skillposts',
  imports: [NgFor,LucideAngularModule,NavbarComponent],
  templateUrl: './skillposts.component.html',
  styleUrl: './skillposts.component.css'
})
export class SkillpostsComponent {

  apiUrl:string=environment.base_url; // Fallback if .env not loaded
  JSON: JSON = JSON;
  constructor(private http: HttpClient) {
    this.fetchAllPosts();
  }

  // ngOnInit() {
  //   // Ensure tags are parsed properly before binding
  //   this.skillPost.map((post)=>{
  //     post.tags= typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
  //   }) 
  // }


  skillPost:SkillPost[]=[];
  fetchAllPosts(){
    this.http.get(`${this.apiUrl}/skillpost/get-all`,{
      withCredentials:true
    }).subscribe((res)=>{  
      console.log("The reponse is ",res);
      this.skillPost = res as SkillPost[];
    },(err)=>{
      console.log("Error while fetching posts",err);
    })
  }


  readonly Heart = Heart;
  currentUser = {
    name: 'John Doe',
    username: 'john_doe',
    avatarUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oIqv4QIhiQKMTOM1vVBpBsZ04Bwclx.png'
  };


  likePost(post: SkillPost) {
    post.likes++;
  }
}
