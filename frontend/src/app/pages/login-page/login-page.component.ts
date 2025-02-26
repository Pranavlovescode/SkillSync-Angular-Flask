import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

declare const _NGX_ENV_: any;



@Component({
  selector: 'app-login-page',
  imports: [NgIf,NgClass,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  loginForm: FormGroup;
  isLoading = false;
  // configService = Inject(ConfigService);
  apiUrl: string = environment.base_url; // Fallback if .env not loaded
  

  constructor(private fb: FormBuilder, private router: Router , private http:HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {

      // const formData = new FormData();
      // formData.append('email', this.loginForm.get('email')?.value || ''); 
      // console.log("Email:", this.loginForm.get('email')?.value);

      // formData.append('password',this.loginForm.get('password')?.value || "");
      // console.log("Password", this.loginForm.get('password')?.value);

      const payload ={
        "email":this.loginForm.get('email')?.value,
        "password":this.loginForm.get('password')?.value
      }

      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        console.log(this.apiUrl)
        console.log('Login submitted', this.loginForm.value);
        this.http.post(`${this.apiUrl}/auth/login`, payload,{
          headers:{
            'Content-Type':'application/json'
          },
        }).subscribe((res)=>{
          console.log("Login response",res);
          this.isLoading = false;
          // Navigate to home page or dashboard after successful login
          this.router.navigate(['/home']);
        },(err)=>{
          console.log("Error while logging in",err);
        })
        

        
      }, 1500);
    }
  }
}
