import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

 private  Trainer_APIURL ="http://localhost:1000/trainerbyid";
  
  // private APIURL = "http://localhost:1000";
  private APIURL = "https://demo-eosin-psi.vercel.app";



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


  // *************** Product API *****************
      addProduct(productData: FormData): Observable<any> {
        return this.http.post(this.APIURL, productData);
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

  // *************** Enquiry API *****************

      deleteEnquiryBYID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/enquiries/${_id}`)
      }    

  // *************** Appointment *****************
      deleteAppointmentbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/appointment/${_id}`);
      }

  // *************** Appointment *****************

      deletequestionbyID(_id: string):Observable<any>{
        return this.http.delete<any>(`${this.APIURL}/${_id}`);
      }


  // ****************** Trainer Profile *********************    
      getprofile(id:string):Observable<any>{
        return this.http.get<any>(`${this.APIURL}/trainerbyid/${id}`);
      }
}
