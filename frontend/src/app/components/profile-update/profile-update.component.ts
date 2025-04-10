import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, input, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string;
  bio: string;
  location: string;
  website: string;
  joined_on: {
    $date: Date;
  };
  skills: string[];
}

@Component({
  selector: 'app-profile-update',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css',
})
export class ProfileUpdateComponent implements OnInit {
  profileForm!: FormGroup;

  initForm(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      bio: [null],
      location: ['', [Validators.required]],
      website: [null],
      skills: this.fb.array([]),
      profile_picture: [null],
    });
  }

  profile: UserProfile = {
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    profile_picture: '',
    bio: '',
    location: '',
    website: '',
    joined_on: { $date: new Date() },
    skills: [],
  };

  skills: string[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  apiUrl: string = environment.base_url;

  ngOnInit(): void {
    // Initialize the form first
    this.initForm();

    // Then fetch profile data
    this.http
      .get<UserProfile>(`${this.apiUrl}/auth/get-profile`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('The response is ', res);
          this.profile = res;

          // Update form with profile data
          this.profileForm.patchValue({
            first_name: res.first_name,
            last_name: res.last_name,
            username: res.username,
            bio: res.bio || '',
            location: res.location || '',
            website: res.website || '',
            profile_picture: res.profile_picture || '',
          });

          // Handle skills separately since it's a FormArray
          const skillsArray = this.skillsArray;
          // Clear existing skills
          while (skillsArray.length) {
            skillsArray.removeAt(0);
          }
          // Add skills from response
          if (res.skills && Array.isArray(res.skills)) {
            res.skills.forEach((skill) => {
              if (skill && typeof skill === 'string') {
                skillsArray.push(this.fb.control(skill));
              }
            });
          }
        },
        error: (err) => {
          console.log('Error while fetching profile', err);
        },
      });
    // this.profileService.getCurrentUserProfile().subscribe({
    //   next: (profile) => {
    //     this.profile = profile;
    //   },
    //   error: (error) => {
    //     console.error('Error loading profile', error);
    //   }
    // });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.profileForm.patchValue({ profile_picture: file });
    this.profileForm.get('profile_picture')?.updateValueAndValidity();

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.profile_picture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toDateString();
  }

  get skillsArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  saveProfile(): void {
    console.log('The form value is ', this.profileForm.value);

    const formData = new FormData();

    // Add all form fields to FormData
    formData.append('first_name', this.profileForm.value.first_name);
    formData.append('last_name', this.profileForm.value.last_name);
    formData.append('username', this.profileForm.value.username);
    formData.append('bio', this.profileForm.value.bio || '');
    formData.append('location', this.profileForm.value.location || '');
    formData.append('website', this.profileForm.value.website || '');

    this.profileForm.value.skills.forEach((skill: string) => {
      formData.append('skills', skill);
    });

    // Add profile picture if it exists
    const imageFile = this.profileForm.get('profile_picture')?.value
    if (imageFile instanceof File) {
      formData.append(
        'profile_picture',
        imageFile
      );
    }

    // Debugging FormData
    formData.forEach((value, key) => {
      console.log(`Formdata: ${key}:`, value);
    });

    // Send the data to the backend
    this.http
      .patch(`${this.apiUrl}/auth/update-profile`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('Profile updated successfully', res);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error updating profile', err);
        },
      });

    if (this.profileForm.valid) {
      // Get the current form values
      const formValue = this.profileForm.value;

      // Filter out empty skills
      const skills = this.skillsArray.value.filter(
        (skill: string) => skill && skill.trim() !== ''
      );

      // Prepare the final form data
      const profileData = {
        ...formValue,
        skills,
      };

      // console.log("The form value is ",profileData);
    }

    // Save profile changes
    // this.profileService.updateProfile(this.profile).subscribe({
    //   next: () => {
    //     // Navigate to view profile page after successful save
    //     this.router.navigate(['/profile', this.profile.username]);
    //   },
    //   error: (error) => {
    //     console.error('Error saving profile', error);
    //   }
    // });
    // Call the api to update the profile
  }
}
