import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/common_service/trainer.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

      showAppointmentData : any;
      
      constructor(private service:TrainerService){}

      ngOnInit(): void {
          
        this.service.gettrainerdatabyID().subscribe(data =>{
          this.showAppointmentData = data.Appointments;
        })
      }

      onDelete(id: string): void {
        this.service.deleteAppointmentbyID(id).subscribe(
          response => {
            // console.log('Data deleted successfully', response);
            alert("Appointment deleted successfully");
            window.location.reload();
          },
          error => {
            // console.error('Error deleting data', error);
            alert("Error");
          }
        );
    
      }
}
