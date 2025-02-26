import { Component } from '@angular/core';
import {LucideAngularModule,Search,Home} from 'lucide-angular'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly Search = Search;
  readonly home = Home;
}
