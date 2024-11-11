import { Component, Query } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../common_service/auth-service.service';
import { Observable } from 'rxjs';
import { LoginService } from '../common_service/login.service';
import { DashboardService } from '../common_service/dashboard.service';
import { TrainerService } from '../common_service/trainer.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  

  Showcategorydata:any;
  Institutedata:any;
  category: string = '';
  id: string = '';
  type: string = '';  
  keyword: string = '';
  UserImage: string | null = null; 



  role = {
    requested_Role : '',
    business_Name  : '',
  }

  institute = {
    business_Name  : '',
    address_1:'',
  }

  TrainerundersInstitute = {
     instituteId:''
  }

  query: string = '';
  results: any;
  searchitemresult:any[] = [];
  suggestions: any[] = []; 
  


  // isTrainer: boolean = false;
  isUser: boolean = false;
  // isAdmin: boolean = false;
  
  isLoggedIn$: Observable<boolean>;
  user$: Observable<string | null>;
  id$:Observable<string | null>;

  constructor(private authService: AuthServiceService,
    private route:Router, 
    private requst:LoginService, 
    private dservice:DashboardService,
    private service:TrainerService,
    private router:ActivatedRoute) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.authService.user$;
    this.id$ = this.authService.id$;
    console.log("entered id",this.id$);
    this.router.queryParams.subscribe(params => {
    this.category = params['category'];
    this.id = params['id'];
    this.type = params['type'];    // Retrieve the type (table source)
    this.keyword = params['keyword']; // Retrieve the user-entered keyword
    });
  }

  ngOnInit(): void {
    
    this.checkUserRole();

    this.dservice.getcategoryname().subscribe(data => {
      this.Showcategorydata = data;
    });

    this.requst.GetInstitute().subscribe(response => {
      console.log(response);
      this.Institutedata = response?.data;
      
    });

    this.loadTrainerData();
  }

  loadTrainerData(): void {
    this.service.gettrainerbyID().subscribe((data: any) => {
      console.log("Trainer Details", data);     
      this.UserImage = data.trainer_image; 
    });
  }

  searchitem(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement;
    const query = element.value.trim();

    if (query.length > 1) {
      this.dservice.search(query).subscribe(
        result => {
          this.suggestions = this.formatSearchResults(result);
          console.log("Search results", this.suggestions);
        },
        error => {
          console.error('Error:', error);
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  

  onSelectSuggestion(suggestion: any) {
    const enteredKeyword = this.query;
    this.suggestions = [];

    if (suggestion.type === 'course') {
      this.route.navigate(['/relevance/Allcourses'], {
        queryParams: {
          category: suggestion.category_name || 'defaultCategory',  // For courses
          id: suggestion.id,
          type: suggestion.type,
          keyword: enteredKeyword
        }
      });
    } else if (suggestion.type === 'category') {
      this.route.navigate(['/relevance/Allcourses'], {
        queryParams: {
          category: suggestion.name || 'defaultCategory',
          id: suggestion.id,
          type: suggestion.type,
          keyword: enteredKeyword
        }
      });
    } else if (suggestion.type === 'product') {
      this.route.navigate(['/relevance/allproducts'], {
        queryParams: {
          category: suggestion.category || 'defaultCategory', // For products
          id: suggestion.id,
          type: suggestion.type,
          keyword: enteredKeyword
        }
      });
    } else if (suggestion.type === 'event') {
      this.route.navigate(['/relevance/allevents'], {
        queryParams: {
          category: suggestion.events_category || 'defaultCategory',
          id: suggestion.id,
          type: suggestion.type,
          keyword: enteredKeyword
        }
      });
    }
   
    else if (suggestion.type === 'trainer') {
      const trainerCategory = suggestion.trainer_categories.length > 0 ? suggestion.trainer_categories[0] : 'defaultCategory';
      console.log(trainerCategory);
      
      this.route.navigate(['/relevance/alltrainer'], {
        queryParams: {
          category: trainerCategory,
          id: suggestion.id,
          type: suggestion.type,
          keyword: enteredKeyword
        }
        
      });
      console.log(trainerCategory);
    }

    else if (suggestion.type === 'institute') {
      this.route.navigate(['/coursedetails'], {
        queryParams: {
          id: suggestion.id // Pass the ID as a query parameter
        }
      });
    }
  
  }

  formatSearchResults(result: any): any[] {
    const formattedResults = [];
    if (result.Courses) {
      formattedResults.push(...result.Courses.map((course: any) => ({
        type: 'course',
        name: course.course_name,
        category_name: course.category_name,  // Add category_name for courses
        id: course._id
      })));
    }

    if (result.Products) {
      formattedResults.push(...result.Products.map((product: any) => ({
        type: 'product',
        name: product.product_name,
        category: product.category,  // categoryid contains category_name
        id: product._id
      })));
    }

    if (result.categories) {
      formattedResults.push(...result.categories.map((category: any) => ({
        type: 'category',
        name: category.category_name,
        id: category._id
      })));
    }

    if (result.Events) {
      formattedResults.push(...result.Events.map((event: any) => ({
        type: 'event',
        name: event.event_name,
        events_category: event.events_category,
        id: event._id
      })));
    }

    // if (result.Trainers) {
    //   formattedResults.push(...result.Trainers.map((trainer: any) => ({
    //     type: 'trainer',
    //     name: trainer.f_Name,
    //     B_Name : trainer.business_Name,
    //     trainer_categories: trainer.trainer_categories,
    //     id: trainer._id
    //   })));
    // }

    if (result.Trainers) {
      formattedResults.push(...result.Trainers.map((trainer: any) => ({
        type: 'trainer',
        name: `${trainer.f_Name} (${trainer.business_Name})`,
        trainer_categories: trainer.trainer_categories,
        id: trainer._id
      })));
    }

    if (result.institute) {
      formattedResults.push(...result.institute.map((institute: any) => ({
        type: 'institute',
        name: institute.institute_name,
        id: institute._id
      })));
    }

    if (result.InstituteDummy) {
      formattedResults.push(...result.InstituteDummy.map((institute: any) => ({
        type: 'institute',
        name: institute.institute_name,
        id: institute._id
      })));
    }
    return formattedResults;
  }

  

  
  onsearch() {
    if (this.query) {
      this.dservice.search(this.query).subscribe(
        data => {
          this.results = this.formatSearchResults(data);
          console.log(this.results);
        },
        error => {
          alert("Invalid Query");
          console.error('Error:', error);
        }
      );
    }
  }

  groupedSuggestions(): Record<string, any[]> {
    return this.suggestions.reduce((groups: Record<string, any[]>, suggestion) => {
      const { type } = suggestion;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(suggestion);
      return groups;
    }, {});
  }
  
  navigateBasedOnGroup(groupKey: string) {
    switch (groupKey) {
      case 'course':
        this.route.navigate(['/relevance/Allcourses']);
        break;
      case 'trainer':
        this.route.navigate(['/relevance/alltrainer']);
        break;
      case 'product':
        this.route.navigate(['/relevance/allproducts']);
        break;
      case 'event':
        this.route.navigate(['/relevance/allevents']);
        break;
      case 'institute':
          this.route.navigate(['/relevance/alltrainer']);
          break;
      // Add more cases as needed
      default:
        console.log('No route defined for this group');
    }
  }

  logout() {
    this.authService.logout();
      this.route.navigate(['/']);
  }

  onSubmit() {
    if (this.role.requested_Role === 'INSTITUTE') {
      this.addinstitute();
    }
    else if(this.role.requested_Role === 'TRAINER'){
      this.addtrainerunderinstitute();
    }
     else {
      this.sendRequest();
    }
  }

  // sendRequest(){

  //   this.requst.postrequest(this.role).subscribe({
  //     next : (response) =>{
  //       // alert("Request Sent For Self Expert.!!!");
  //       Swal.fire('Congratulations..!', 'Your request has been successfully submitted to the admin. You can expect access to the Self Expert role within the next 24 hours. If you experience any issues, please don’t hesitate to reach out to us at contact@ximboa.io.', 'success');
  //       // window.location.reload();
  //     },
  //     error: (error)=>{
  //       console.log(alert("Error"),error);
  //     }
  //   })

  // }


  sendRequest() {
    this.requst.postrequest(this.role).subscribe({
      next: (response) => {
        Swal.fire(
          'Congratulations..!',
          'Your request has been successfully submitted to the admin. You can expect access to the Self Expert role within the next 24 hours. If you experience any issues, please don’t hesitate to reach out to us at contact@ximboa.io.',
          'success'
        );
        this.closeModal();
      },
      error: (error) => {
        console.error("Error:", error);
  
        // Check for specific error message and status code in the nested error response
        if (error?.error?.statusCode === 400 && error?.error?.message === "Role change request is already pending.") {
          Swal.fire(
            'Request Already Submitted',
            'Your request for access to the Self Expert role has already been submitted. Please allow up to 24 hours for processing. If you have any questions or concerns, feel free to contact us at contact@ximboa.io.',
            'error'
          );
        } else {
          // Show a generic error message for other cases
          Swal.fire(
            'Request Failed',
            'An unexpected error occurred. Please try again later.',
            'error'
          );
        }
      }
    });
  }
  
  

  addinstitute(){
    const payload = {
      ...this.role,               
      ...this.institute            
    };

    console.log("Sending Institute Request:", payload); // Debugging: Check payload

    this.requst.postrequest(payload).subscribe({
      next : (response) =>{
        alert("Request Sent For Institute.!!!")
        window.location.reload();
      },
      error: (error)=>{
        console.log(alert("Error"),error);
      }
    })

  }

  addtrainerunderinstitute(){
    const payload = {
      ...this.role,               
      ...this.TrainerundersInstitute            
    };

    console.log("Sending Institute Request:", payload); // Debugging: Check payload

    this.requst.postrequest(payload).subscribe({
      next : (response) =>{
        alert("Request Sent For Institute.!!!")
        window.location.reload();
      },
      error: (error)=>{
        console.log(alert("Error"),error);
      }
    })

  }




  checkUserRole() {
    const role = this.authService.getUserRole();
    console.log('User Role:', role);

    // this.isAdmin = role === 'ADMIN';
    // this.isTrainer = role === 'TRAINER';
    this.isUser = role === 'USER';

    console.log('isUser:', this.isUser);
}


onRoleChange() {
  console.log('Selected Role:', this.role.requested_Role);
}  

closeModal() {
  const modalElement = document.getElementById('exampleModalExpert');
  const modalInstance = bootstrap.Modal.getInstance(modalElement); // Returns a Bootstrap modal instance
  if (modalInstance) {
    modalInstance.hide(); // Hides the modal
  }
}

}
