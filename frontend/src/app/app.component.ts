import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import {LucideAngularModule,Search,Home} from 'lucide-angular'; 
// import { SkillpostsComponent } from './components/skillposts/skillposts.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // styles:['node_modules/material-icons/iconfont/material-icons.css']
})
export class AppComponent {
  title = 'SkillSync';
  
}
