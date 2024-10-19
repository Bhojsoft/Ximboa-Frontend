import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/common_service/student.service';

@Component({
  selector: 'app-student-course',
  templateUrl: './student-course.component.html',
  styleUrls: ['./student-course.component.css']
})
export class StudentCourseComponent implements OnInit{

  showcoursedata:any[]=[];

  constructor(private service:StudentService){}

  ngOnInit(): void {
    this.service.getstudentdatabyID().subscribe((result:any) =>{
      // console.log("Show course Data",result);
      this.showcoursedata = result.coursesWithFullImageUrl;
    })
  }

}
