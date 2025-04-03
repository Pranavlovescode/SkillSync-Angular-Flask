import { Component } from '@angular/core';
import {LucideAngularModule,Search,Home} from 'lucide-angular'; 
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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
}
