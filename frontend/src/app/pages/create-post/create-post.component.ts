import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


declare const _NGX_ENV_: any;

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule,NavbarComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  postForm: FormGroup;
  tags: string[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  videoPreview: string | null = null;
  apiUrl:string=environment.base_url; // Fallback if .env not loaded
  _isLoading: boolean = false;
  showSuccessAlert: boolean = false;


  constructor(private fb: FormBuilder, private http:HttpClient) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tag: [''],
      image: [null],
      video: [null]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.postForm.valid) {
      this._isLoading = true;
      const formData = new FormData();
  
      formData.append('title', this.postForm.get('title')?.value || '');
      formData.append('description', this.postForm.get('description')?.value || ''); // Fixed here
      this.tags.forEach(tag => formData.append("tags", tag));
      const imageFile = this.postForm.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }
  
      const videoFile = this.postForm.get('video')?.value;
      if (videoFile instanceof File) {
        formData.append('video', videoFile);
      }
  
      // Debugging FormData
      formData.forEach((value, key) => {
        console.log(`Formdata: ${key}:`, value);
      });
  
      this.http.post(`${this.apiUrl}/skillpost/create`, formData,{
        withCredentials: true
      }).subscribe(
        (res) => {
          console.log("Post response", res);
          this._isLoading = false;
          this.showSuccessAlert= true;
          setTimeout(()=>{
            this.showSuccessAlert = false;
          }, 5000);
        },
        (err) => {
          console.log("Error while posting", err);
          setTimeout(()=>{
            this._isLoading = false;

          }, 5000);
        }
      );
  
      // Reset the form
      this.postForm.reset();
      this.tags = [];
      this.imagePreview = null;
      this.videoPreview = null;
    }
  }
  
  

  addTag() {
    const tag = this.postForm.get('tag')?.value;
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.postForm.get('tag')?.reset();
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image')?.updateValueAndValidity();

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.postForm.patchValue({ video: file });
    this.postForm.get('video')?.updateValueAndValidity();

    if (file) {
      this.videoPreview = URL.createObjectURL(file);
    }
  }

  removeImage() {
    this.postForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  removeVideo() {
    this.postForm.patchValue({ video: null });
    this.videoPreview = null;
  }
}
