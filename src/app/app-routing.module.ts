import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RelevanceComponent } from './relevance/relevance.component';
import { RelevanceDataComponent } from './relevance-data/relevance-data.component';
import { CoursesComponent } from './courses/courses.component';
import { TrainerComponent } from './trainer/trainer.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { SeeallcategoriesComponent } from './seeallcategories/seeallcategories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminDashboardCategoriesComponent } from './admin/admin-dashboard-categories/admin-dashboard-categories.component';
import { AdminCoursesComponent } from './admin/admin-courses/admin-courses.component';
import { InstructorComponent } from './admin/instructor/instructor.component';
import { EnrollNowComponent } from './enroll-now/enroll-now.component';
import { CourseenrollComponent } from './courseenroll/courseenroll.component';
import { TrainerHomeComponent } from './trainer_dashboard/trainer-home/trainer-home.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { EdittrainerComponent } from './edittrainer/edittrainer.component';
import { MyCourseComponent } from './trainer_dashboard/my-course/my-course.component';
import { QuestionComponent } from './trainer_dashboard/question/question.component';
import { AppointmentComponent } from './trainer_dashboard/appointment/appointment.component';
import { EventComponent } from './trainer_dashboard/event/event.component';
import { EnquiryComponent } from './trainer_dashboard/enquiry/enquiry.component';
import { ProductComponent } from './trainer_dashboard/product/product.component';
import { EditCourseComponent } from './trainer_dashboard/edit-course/edit-course.component';
import { EditCategoryComponent } from './Admin/edit-category/edit-category.component';
import { UpdateProductComponent } from './trainer_dashboard/update-product/update-product.component';
import { UpdateEventComponent } from './trainer_dashboard/update-event/update-event.component';
import { UpdateCourseComponent } from './admin/update-course/update-course.component';
import { LoginComponent } from './Student_Dashboard/login.component';
import { StudentRegisterComponent } from './Student_Dashboard/student-register/student-register.component';
import { StudentHomeComponent } from './Student_Dashboard/student-home/student-home.component';
import { StudentCourseComponent } from './Student_Dashboard/student-course/student-course.component';
import { TrainerMyhomeComponent } from './trainer_dashboard/trainer-myhome/trainer-myhome.component';
import { StudentDashboardComponent } from './Student_Dashboard/student-dashboard/student-dashboard.component';
import { CartComponent } from './cart/cart.component';
import { UsersideProductComponent } from './userside-product/userside-product.component';
import { UserEventComponent } from './user-event/user-event.component';
import { UserEventDetailsComponent } from './user-event-details/user-event-details.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ReviewComponent } from './trainer_dashboard/review/review.component';
import { NotificationComponent } from './notification/notification.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { BlogComponent } from './blog/blog/blog.component';
import { AboutComponent } from './about/about.component';
import { FAQComponent } from './faq/faq.component';
import { EditProfilePictureComponent } from './edit-profile-picture/edit-profile-picture.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LinkedinAuthCallbackComponent } from './linkedin-auth-callback/linkedin-auth-callback.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ContactComponent } from './contact/contact.component';
import { ForumComponent } from './forum/forum.component';
import { ForumDetailsComponent } from './forum-details/forum-details.component';

const routes: Routes = [

  { path: "signin", component: SignInComponent },
  { path: "signup", component: SignUpComponent },
  { path: "reset-password",component:ResetPasswordComponent},
  { path: "forgotfassword", component: ForgotPasswordComponent },
  { path: "auth/linkedin", component: LinkedinAuthCallbackComponent },

  // Routing For Super Admin Dashboard
  { path: "superadmin", component: SuperAdminComponent },

  // Routing For Admin Dashboard
  {
    path: "admin", component: AdminDashboardComponent,
    children: [
      { path: "", component: AdminHomeComponent },
      { path: "adminhome", component: AdminHomeComponent },
      { path: "admincategory", component: AdminDashboardCategoriesComponent },
      { path: "admincourse", component: AdminCoursesComponent },
      { path: "instructors", component: InstructorComponent },
    ]
  },

  { path: "editcategory/:_id", component: EditCategoryComponent },
  { path: "updatecourse/:_id", component: UpdateCourseComponent },
  { path: "Notification", component: NotificationComponent },
  { path: "editprofilepicture", component: EditProfilePictureComponent },

  //  Routing For Trainer Dashboard
  {
    path: "trainer", component: TrainerHomeComponent,
    children: [
      { path: "", component: TrainerMyhomeComponent },
      { path: "superadmin", component: SuperAdminComponent },
      { path: "admincategory", component: AdminDashboardCategoriesComponent },
      { path: "mycourse", component: MyCourseComponent },
      { path: "product", component: ProductComponent },
      { path: "question", component: QuestionComponent },
      { path: "appointment", component: AppointmentComponent },
      { path: "event", component: EventComponent },
      { path: "enquiry", component: EnquiryComponent },
      { path: "review", component: ReviewComponent },
    ] },
  { path: "edittrainer", component: EdittrainerComponent },
  { path: "editcourse/:_id", component: EditCourseComponent },
  { path: "editproduct/:_id", component: UpdateProductComponent },
  { path: "editevent/:_id", component: UpdateEventComponent },


  //  Routing For User Dashboard
  { path: "", component: DashboardComponent },
  { path: "Home", component: DashboardComponent },
  { path: "seeallcategories", component: SeeallcategoriesComponent },
  { path: "coursedetails/:id", component: CourseDetailsComponent },
  { path: "shop/:id", component: ShopComponent },
  { path: "eventdetails/:id", component: UserEventDetailsComponent },
  { path: "cart", component: CartComponent },
  { path: "gallery", component: GalleryComponent },
  {
    path: "relevance", component: RelevanceComponent,
    children: [
      // {path:"",component:RelevanceDataComponent},
      { path: "", component: SeeallcategoriesComponent },
      { path: "seeallcategory", component: SeeallcategoriesComponent },
      { path: "relevancedata", component: RelevanceDataComponent },
      { path: "courses", component: CoursesComponent },
      { path: "trainer", component: TrainerComponent },
      { path: "userproduct", component: UsersideProductComponent },
      { path: "userevent", component: UserEventComponent },
    ]
  },

  { path: "couserenroll/:id", component: CourseenrollComponent },
  { path: "enrollNow", component: EnrollNowComponent },

  // Routing For Student Dashborad
  { path: "login", component: LoginComponent },
  { path: "register", component: StudentRegisterComponent },
  {
    path: "student", component: StudentHomeComponent,
    children: [
      { path: "student-course", component: StudentCourseComponent },
      { path: "studentDashboard", component: StudentDashboardComponent },
    ]
  },

  // blog     
  { path: "blog", component: BlogComponent },
  { path: "blogdetails/:id", component: BlogDetailsComponent },
  { path: "about", component: AboutComponent },
  { path: "faq", component: FAQComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "Contact", component:ContactComponent},
  { path: "forum",component:ForumComponent},
  { path: "forum-details",component:ForumDetailsComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
