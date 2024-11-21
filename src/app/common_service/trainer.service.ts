import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

 private  Trainer_APIURL ="http://13.203.89.189/api/trainerbyid";

  private APIURL = "http://13.203.89.189/api";
  private apiUrl = 'http://13.203.89.189/api/event/get/my-registered-events';


  constructor(private http:HttpClient) { }

  // *************** Trainer Profile API *****************
      gettrainerbyID():Observable<any>{
        return this.http.get<any>(`${this.APIURL}/registration/trainer`);
      }

      updatetrainerDetails(formData:FormData):Observable<any>{
        return this.http.put<any>(`${this.APIURL}/registration/update`,formData)
      }

      postSocialLinks(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/socialMedia`,formData)
      }

      postEducation(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/education`,formData)
      }

      postabout(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/about`,formData)
      }

      postskills(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/registration/addskills`,formData)
      }

      posttestimonial(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/testmonial`,formData)
      }

      postgallary(formData:FormData):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/gallary`,formData)
      }

  // *************** Course API *****************

      gettrainerdatabyID():Observable<any>{
        let headers = new HttpHeaders()
        .set("Authorization", `Bearer ${sessionStorage.getItem('Authorization')}`)
        return this.http.get<any>(`${this.APIURL}/trainers`,{headers});
        
      }

      deleteCoursebyID(_id: string): Observable<any> {
        return this.http.delete(`${this.APIURL}/course/${_id}`);
      }

      updateCorseByID(CID: any, CDATA:FormData):Observable<any>{
        return this.http.put<any>(`${this.APIURL}/course/${CID}`,CDATA);
      }


  // *************** Event API *****************
      geteventdata():Observable<any>{
        return this.http.get<any>(`${this.APIURL}/trainers`)
      }

      AddEvent(eventData: FormData): Observable<any> {
        return this.http.post<any>(`${this.APIURL}/event`, eventData);
      }

      deleteEvent(_id:any):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/event/${_id}`)
      }

      geteventbyID(_id:any):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/event/${_id}`);
      }

      UpdateEventbyID(_id : string, formData:any):Observable<any>{
        return this.http.put<any>(`${this.APIURL}/event/${_id}`,formData)
      }

      getRegisteredEvents(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
      }

  // *************** Product API *****************
      addProduct(productData: FormData): Observable<any> {
        return this.http.post(`${this.APIURL}/product`, productData);
      }

      deleteproductBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/product/${_id}`);
      }

      getproductById(_id:string):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/product/${_id}`);
      }

      updateproductbyID(_id : string, formData:FormData ):Observable<any>{
        return this.http.put<any>(`${this.APIURL}/product/${_id}`,formData)
      }

      getproductdatabyID():Observable<any>{
        return this.http.get<any>(`${this.APIURL}/product/get/my-registered-product`);
      }

  // *************** Enquiry API *****************

      deleteEnquiryBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/enquiries/${_id}`)
      }    


      GetEnquiry(page: number, limit: number):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/enquiries/trainer?page=${page}&limit=${limit}`);
       }

  // *************** Appointment *****************
      deleteAppointmentbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/appointment/${_id}`);
      }

   // Function to approve an appointment
  approveAppointment(id: string): Observable<any> {
    return this.http.put<any>(`${this.APIURL}/appointment/${id}/approve`, {});
  }

  // Function to reject an appointment
  rejectAppointment(id: string,rejectionReason: string): Observable<any> {
    return this.http.put<any>(`${this.APIURL}/appointment/${id}/reject`,{ reason: rejectionReason });
  }

  
  // *************** Appointment *****************

      deletequestionbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/${_id}`);
      }



  // ****************** Trainer Profile *********************    
      getprofile(id:string):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/trainerbyid/${id}`);
      }

      GetAppointment(page: number, limit: number):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/appointment/trainer?page=${page}&limit=${limit}`);
       }


      //  ****************** 	Question ********************* 
      
      GetQuestion(page: number, limit: number):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/questions/trainer?page=${page}&limit=${limit}`);
       }
      
       deleteQuestionBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/questions/${_id}`)
      }  


}
