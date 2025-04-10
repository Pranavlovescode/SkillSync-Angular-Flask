import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPageComponent implements OnInit {
  signupForm!: FormGroup;
  apiUrl: string = environment.base_url;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        termsAccepted: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Here you would typically call your authentication service to register the user
      console.log('Form submitted:', this.signupForm.value);

      // Navigate to login or dashboard page after successful signup
      this.http
        .post(`${this.apiUrl}/auth/signup`, this.signupForm.value, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .subscribe((res) => {
          console.log('Signup response', res);
          alert('Signup successful!');
          this.router.navigate(['/home']);
        },(err)=>{
          console.log("Error while signing up",err);
        })

      
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signupForm.controls).forEach((key) => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
