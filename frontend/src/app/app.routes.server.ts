import { RenderMode, ServerRoute } from '@angular/ssr';
import { getPrerenderParams } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile/:username',
    renderMode: RenderMode.Client
  },
  {
    path: 'skillpost-details/:postId',
    renderMode: RenderMode.Client
  },
  {
    path: 'create-post',
    renderMode: RenderMode.Client
  },
  {
    path: 'edit-profile',
    renderMode: RenderMode.Client
  },
  {
    path: 'home',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

// Export the getPrerenderParams function for routes that need prerendering
export { getPrerenderParams };
