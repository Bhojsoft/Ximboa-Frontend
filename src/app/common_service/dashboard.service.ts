import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   
  private beforelogin ="http://localhost:1000/beforeLogin";

    // private beforelogin ="http://192.168.0.14:1000/beforeLogin";


  private Enroll ="http://localhost:1000/enrollcourse";

  private SEOkeyword="http://localhost:1000/footer";

  private Search_API="http://localhost:1000/search/global?q=";

  private API_URL="http://localhost:1000"





  constructor(private http:HttpClient) { }

          getcategoryname():Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/allcategory`);
          }

          getcouserdata(page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/allcourses?page=${page}&limit=${limit}`)
          }

          gethomedatauser(page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/home?page=${page}&limit=${limit}`)
          }

          getcouserdatabyID(id:any):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/course/${id}`)
          }

          gettrainerdata(page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/trainers?page=${page}&limit=${limit}`);
           }

           productdata():Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/allproduct`);
           }

           productdatabyID(id:any):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/product/${id}`);
           }

           GetCourseReview(id:string,page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.API_URL}/review/course/${id}?page=${page}&limit=${limit}`);
           }

           Eventdata():Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/allevents`);
           }

           EventdatabyID(id:any):Observable<any>{
            return this.http.get<any>(`${this.beforelogin}/event/${id}`);
           }

           postreviewEvent(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/review/event`,data)
          }

          GetEventReview(id:string,page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.API_URL}/review/event/${id}?page=${page}&limit=${limit}`);
           }

           courseenroll(data:{course_id: any}): Observable<any> {
            return this.http.post<any>(`${this.Enroll}`, data);
          }

          postreviewProduct(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/review/product`,data)
          }

          GetProductReview(id:string,page: number, limit: number):Observable<any>{
            return this.http.get<any>(`${this.API_URL}/review/product/${id}?page=${page}&limit=${limit}`);
           }

          bookevent(data:{event_id: any}): Observable<any> {
            return this.http.post<any>(`${this.API_URL}/event/registerevent`, data);
          }

          SEOkeywords():Observable<any>{
            return this.http.get<any>(this.SEOkeyword);
          }

          search(query: string):Observable<any>{
            return this.http.get<any>(`${this.Search_API}${query}`)
          }

          postEnquiry(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/enquiries`,data)
          }

          postquestions(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/questions`,data)
          }

          postreview(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/review`,data)
          }

          postreviewCourse(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/review/course`,data)
          }

          BookApnmt(data:any):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/appointment`,data)
          }

          Addtocart(cart:{productId:any, quantity:any}):Observable<any>{
            return this.http.post<any>(`${this.API_URL}/cart/add`,cart)
          }

          getcartproduct():Observable<any>{
           return this.http.get<any>(`${this.API_URL}/cart`);
          }

          deletecartproductbyID(productId: string): Observable<any> {
            return this.http.delete(`${this.API_URL}/cart/remove/${productId}`);
          }

          getblogdata():Observable<any>{
            return this.http.get<any>(`${this.API_URL}/blog`)
          }
         
          blogdatabyID(id: string): Observable<any> {
            const url = `http://localhost:1000/blog/${id}`;  // Adjust the API endpoint
            return this.http.get<any>(url);
          }

          getDashboardData(): Observable<any> {
            return this.http.get<any>(`${this.API_URL}/dashboard`);
          }
}
