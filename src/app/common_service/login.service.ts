import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

//********************** Trainer LOGIN API **********************


    private register ='https://demo-eosin-psi.vercel.app/registration';

    private institute="https://demo-eosin-psi.vercel.app/institute";

    private APIURL ="https://demo-eosin-psi.vercel.app/notifications";
  
    private apiUrl = 'https://demo-eosin-psi.vercel.app/notifications/view/'; 
   


  constructor(private http:HttpClient, private router: Router){ }

    login(data:any):Observable<any>{
      return this.http.post<any>(`${this.register}/login`,data);
    }
  
    postsignupdata(Signup:any):Observable<any>{
      return this.http.post<any>(this.register,Signup);
    }

    forgotpassword(data: { email_id: string }):Observable<any>{
      return this.http.post<any>(`${this.register}/forget-password`,data)
    }

    resetpassword(newPassword: any, token: string): Observable<any> {
      return this.http.post<any>(`${this.register}/reset-password?token=${token}`, { newPassword });
    }
    

    postrequest(data:any):Observable<any>{
      return this.http.post<any>(`${this.register}/request-role-change`,data)
    }

    getrolerequest():Observable<any>{
      return this.http.get<any>(`${this.register}/all-pending-request`)
    }

    getroleApprovedrequest():Observable<any>{
      return this.http.get<any>(`${this.register}/all-approved-request`)
    }

    getRejectRequest():Observable<any>{
      return this.http.get<any>(`${this.register}/all-rejected-request`)
    }

    RoleChange(data: { userid: string, approved: number }): Observable<any> {
      return this.http.post<any>(`${this.register}/approve-role-change`, data);
   }
  
   postinstitute(data:any):Observable<any>{
    return this.http.post<any>(`${this.institute}/create-institute`,data);
   }

   GetInstitute():Observable<any>{
    return this.http.get<any>(`${this.institute}/get-institutes`);
   }

   Notification(page: number, limit: number):Observable<any>{
    let headers = new HttpHeaders()
    .set("Authorization", `Bearer ${sessionStorage.getItem('Authorization')}`)
    return this.http.get<any>(`${this.APIURL}/unseen?page=${page}&limit=${limit}`,{headers});
  }
  // Method to update the notification status
  updateNotificationStatus(notificationId: string, isSeen: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${notificationId}`, { isSeen });
  }
  // Mark all notifications as seen
  markAllNotificationsAsSeen() {
    return this.http.put<any>(`${this.APIURL}/markAllNotificationsAsSeen`, {});
  }

 
  
}
  // getcouserdata(page: number, limit: number):Observable<any>{
  //   return this.http.get<any>(`${this.beforelogin}/allcourses?page=${page}&limit=${limit}`)
  // }


