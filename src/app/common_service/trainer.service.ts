import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  Trainer_APIURL ="http://localhost:1000/trainerbyid";
  
  private APIURL = "http://localhost:1000";

  private Trainer_API ="http://localhost:1000/trainers";

  private Cousers_API="http://localhost:1000/course";

  private product_API ="http://localhost:1000/product";

  private Event_API="http://localhost:1000/event"

  private Appointment="http://localhost:1000/appointment";

  private Trainer ="http://localhost:1000/registration";

  private social = "http://localhost:1000/socialMedia";

  private education = "http://localhost:1000/education"

  constructor(private http:HttpClient) { }

  // *************** Trainer Profile API *****************
      gettrainerbyID():Observable<any>{
        return this.http.get<any>(`${this.Trainer}/trainer`);
      }

      updatetrainerDetails(formData:FormData):Observable<any>{
        return this.http.put<any>(`${this.Trainer}/update`,formData)
      }

      postSocialLinks(formData:any):Observable<any>{
        return this.http.post<any>(`${this.social}`,formData)
      }

      postEducation(formData:any):Observable<any>{
        return this.http.post<any>(`${this.education}`,formData)
      }

      postabout(formData:any):Observable<any>{
        return this.http.post<any>(`${this.APIURL}/about`,formData)
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
        return this.http.get<any>("http://localhost:1000/trainers",{headers});
        
      }

      deleteCoursebyID(_id: string): Observable<any> {
        return this.http.delete(`${this.Cousers_API}/${_id}`);
      }

      updateCorseByID(CID: any, CDATA:FormData):Observable<any>{
        return this.http.put<any>(`${this.Cousers_API}/${CID}`,CDATA);
      }


  // *************** Event API *****************
      geteventdata():Observable<any>{
        return this.http.get<any>(`${this.Trainer_API}`)
      }

      AddEvent(eventData: FormData): Observable<any> {
        return this.http.post<any>(this.Event_API, eventData);
      }

      deleteEvent(_id:any):Observable<any>{
        return this.http.delete<any>(`${this.Event_API}/${_id}`)
      }

      geteventbyID(_id:any):Observable<any>{
        return this.http.get<any>(`${this.Event_API}/${_id}`);
      }

      UpdateEventbyID(_id : string, formData:any):Observable<any>{
        return this.http.put<any>(`${this.Event_API}/${_id}`,formData)
      }


  // *************** Product API *****************
      addProduct(productData: FormData): Observable<any> {
        return this.http.post(this.product_API, productData);
      }

      deleteproductBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.product_API}/${_id}`);
      }

      getproductById(_id:string):Observable<any>{
        return this.http.get<any>(`${this.product_API}/${_id}`);
      }

      updateproductbyID(_id : string, formData:FormData ):Observable<any>{
        return this.http.put<any>(`${this.product_API}/${_id}`,formData)
      }

  // *************** Enquiry API *****************
      deleteEnquiryBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this}/${_id}`)
      }    

  // *************** Appointment *****************
      deleteAppointmentbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.Appointment}/${_id}`);
      }

  // *************** Appointment *****************

      deletequestionbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/${_id}`);
      }


  // ****************** Trainer Profile *********************    
      getprofile(id:string):Observable<any>{
        return this.http.get<any>(`${this.Trainer_APIURL}/${id}`);
      }
}
