import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './common_service/breadcrumb.service';
import { filter } from 'rxjs';
import { ModalServiceService } from './common_service/modal-service.service';


declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'multitainer';

  constructor(private router: Router, private breadcrumbService: BreadcrumbService,private modalService: ModalServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

 ngOnInit() {

      this.modalService.showModal$.subscribe((shouldOpen) => {
        if (shouldOpen) {
          const modalElement = document.getElementById('CheckLoggedIN');
          const modal = new bootstrap.Modal(modalElement!);
          modal.show();
        }
      });

      this.modalService.closeModal$.subscribe((shouldClose) => {
        if (shouldClose) {
          const modalElement = document.getElementById('CheckLoggedIN');
          const modalInstance = bootstrap.Modal.getInstance(modalElement!);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      });

      this.modalService.showLoginModal$.subscribe((shouldOpen) => {
        if (shouldOpen) {
          const modalElement = document.getElementById('LoggedIN');
          const modal = new bootstrap.Modal(modalElement!);
          modal.show();
        }
      });

      this.modalService.closeLoginModal$.subscribe((shouldClose) => {
        if (shouldClose) {
          const modalElement = document.getElementById('LoggedIN');
          const modalInstance = bootstrap.Modal.getInstance(modalElement!);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      });

    }

//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//         const breadcrumbs = this.createBreadcrumbs(this.router.routerState.root);
//         this.breadcrumbService.setBreadcrumbs(breadcrumbs);
//       });
//   }

//   private createBreadcrumbs(route: ActivatedRoute, breadcrumbs: Array<{ label: string, url: string }> = [], url: string = ''): Array<{ label: string, url: string }> {
//     const children: ActivatedRoute[] = route.children;
  
//     if (children.length === 0) {
//       return breadcrumbs;
//     }
  
//     for (const child of children) {
//       const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//       if (routeURL !== '') {
//         url += `/${routeURL}`;
//       }
  
//       const breadcrumbLabel = child.snapshot.data['breadcrumb'];
//       if (breadcrumbLabel) {
//         breadcrumbs.push({ label: breadcrumbLabel, url });
//       }
  
//       return this.createBreadcrumbs(child, breadcrumbs, url);
//     }
    
//     // Example of adding static breadcrumbs that don't correspond to any route
//     if (route.routeConfig?.path === 'someStaticPath') {
//       breadcrumbs.push({ label: 'Static Breadcrumb', url: '/static-path' });
//     }
  
//     return breadcrumbs;
//   }
  

}
