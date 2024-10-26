import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  Shownotification: any;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 7;  
  p: number = 1;

  constructor(private service: LoginService) {}

  ngOnInit(): void {
    this.loadNotifications(this.currentPage, this.itemsPerPage);
  }

  loadNotifications(page: number, limit: number) {
    this.service.Notification(page, limit).subscribe(result => {
      console.log(result);
      this.Shownotification = result.notifications;
      this.totalItems = result.pagination.totalItems;
      console.log("data",this.totalItems);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications(this.currentPage, this.itemsPerPage); 
    this.p = page;
  }
}
