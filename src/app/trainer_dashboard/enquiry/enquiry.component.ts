import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/common_service/trainer.service';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

  showenquirydata : any;

  constructor(private service:TrainerService){}

    ngOnInit(): void {
          this.service.gettrainerdatabyID().subscribe(data => {            
            this.showenquirydata = data.Enquirys;
            console.log(this.showenquirydata);
          })
    }

    onDelete(id: string): void {
      this.service.deleteEnquiryBYID(id).subscribe(
        response => {
          // console.log('Data deleted successfully', response);
          alert("Product deleted successfully");
          window.location.reload();
        },
        error => {
          // console.error('Error deleting data', error);
          alert("Error");
        }
      );
    }
}
