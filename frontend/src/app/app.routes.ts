import { Routes } from '@angular/router';
import { SkillpostDetailsComponent } from './pages/skillpost-details/skillpost-details.component';
import { ProfileComponent } from './pages/profile/profile.component';


export const routes: Routes = [
  {
    path: 'explore',
    pathMatch: 'full',
    async loadComponent() {
      const m = await import('./pages/explore/explore.component');
      return m.ExploreComponent;
    },
  },
  {
    path: 'home',
    pathMatch: 'full',
    async loadComponent() {
      const m = await import('./components/skillposts/skillposts.component');
      return m.SkillpostsComponent;
    },
    data: {
      renderMode: 'client'
    }
  },
  {
    path: 'profile/:username',
    pathMatch: 'full',
    component: ProfileComponent,
    data: {
      renderMode: 'client'
    }
  },
  {
    path: 'create-post',
    pathMatch: 'full',
    async loadComponent() {
      const m = await import('./pages/create-post/create-post.component');
      return m.CreatePostComponent;
    },
    data: {
      renderMode: 'client'
    }
  },
  {
    path: '',
    pathMatch: 'full',
    async loadComponent() {
      const m = await import('./pages/login-page/login-page.component');
      return m.LoginPageComponent;
    },
  },
  {
    path:'signup',
    pathMatch:'full',
    async loadComponent() {
      const m = await import('./pages/signup-page/signup-page.component');
      return m.SignupPageComponent;
    }
  },
  {
    path:'edit-profile',
    pathMatch:'full',
    async loadComponent() {
      const m = await import('./components/profile-update/profile-update.component');
      return m.ProfileUpdateComponent;
    },
    data: {
      renderMode: 'client'
    }
  },
  {
    path:"skillpost-details/:postId",
    pathMatch:"full",
    component:SkillpostDetailsComponent,
    data:{
      renderMode:'client'
    }
  }
];

export function getPrerenderParams() {
  return [
    {
      route: 'profile/:username',
      params: {
        username: 'john-doe' // 👈 Replace with example/prebuilt usernames
      }
    },
    {
      route: 'skillpost-details/:postId',
      params: {
        postId: '123' // 👈 Replace with example/prebuilt postIds
      }
    }
  ];
}
