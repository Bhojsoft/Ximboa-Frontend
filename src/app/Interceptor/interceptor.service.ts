import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('Authorization');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = sessionStorage.getItem('Authorization');
    
  //   if (token) {
  //     console.log('Interceptor: Token found, modifying request...');
  //     const cloned = req.clone({
  //       headers: req.headers.set("Authorization", `Bearer ${token}`)
  //     });

  //     return next.handle(cloned);
  //   } else {
  //     console.log('Interceptor: No token found, proceeding without modification.');
  //     return next.handle(req);
  //   }
  // }

}
