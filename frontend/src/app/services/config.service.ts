import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
    providedIn:'root'
})

export class ConfigService{
    private apiUrl = 'http://127.0.0.1:8000';
    constructor(private http:HttpClient){
    }
    createSkillPost(formData: FormData){
        return this.http.post(`${this.apiUrl}/skillpost/create`, formData).subscribe((response)=>{
            console.log("skill post reponse",response);
        },(err)=>{
            console.log("error while creating post",err);
        })
    }
    loginUser(formData:FormData){
        return this.http.post(`${this.apiUrl}/auth/login`, formData).subscribe((res)=>{
            console.log("Login response",res);
        }
        ,(err)=>{
            console.log("Error while logging in",err);
        })
    }
}