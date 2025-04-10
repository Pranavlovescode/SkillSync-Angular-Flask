import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, input, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
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
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css',
})
export class ProfileUpdateComponent implements OnInit {
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

  constructor(private router: Router, private http: HttpClient) {}

  apiUrl: string = environment.base_url;

  ngOnInit(): void {
    this.http
      .get<UserProfile>(`${this.apiUrl}/auth/get-profile`, {
        withCredentials: true,
      })
      .subscribe(
        (res) => {
          console.log('The response is ', res);
          this.profile = res;
        },
        (err) => {
          console.log('Error while fetching profile', err);
        }
      );
    // Get user profile data from service
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
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Show a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.profile_picture = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload the file to your server/storage
      // this.profileService.uploadProfilePhoto(file).subscribe({
      //   next: (url) => {
      //     // The service should return the URL where the photo was saved
      //     this.profile.photoUrl = url;
      //   },
      //   error: (error) => {
      //     console.error('Error uploading photo', error);
      //   }
      // });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toDateString();
  }

  addSkill(): void {
    console.log('Adding skill...');
    this.skills.push('');
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  saveProfile(): void {
    // Filter out empty skills
    this.profile.skills = this.profile.skills.filter(
      (skill) => skill.trim() !== ''
    );

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
