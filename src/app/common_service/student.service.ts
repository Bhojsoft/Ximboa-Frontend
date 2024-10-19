import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  loginUrl="http://localhost:1000/student"

  constructor(private http:HttpClient) { }

  login(data:any):Observable<any>{
    return this.http.post<any>(`${this.loginUrl}/login`,data);
  }

  postsignupdata(Signup:any):Observable<any>{
    return this.http.post<any>(`${this.loginUrl}/register`,Signup);
  }

  
  getstudentdatabyID():Observable<any>{
    let headers = new HttpHeaders()
    .set("Authorization", `Bearer ${sessionStorage.getItem('Authorization')}`)
    return this.http.get<any>("http://localhost:1000/enrollcourse/student",{headers});
  }


}
