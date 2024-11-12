import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  Shownotification: any[] = [];  // All notifications
  unreadNotifications: any[] = [];  // Unread notifications
  readNotifications: any[] = [];  // Read notifications
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 100;
  p: number = 1;

  notificationsToDisplay: any[] = []; // Notifications to display

  constructor(private service: LoginService) {}

  ngOnInit(): void {
    this.loadNotifications(this.currentPage, this.itemsPerPage);
  }

  loadNotifications(page: number, limit: number) {
    this.service.Notification(page, limit).subscribe(result => {
      console.log(result);
      this.Shownotification = result.notifications;
      this.totalItems = result.pagination.totalItems;

      // Separate notifications into read and unread
      this.unreadNotifications = this.Shownotification.filter((notif: any) => !notif.isSeen);
      this.readNotifications = this.Shownotification.filter((notif: any) => notif.isSeen);

      // By default, show all notifications
      this.notificationsToDisplay = this.Shownotification;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications(this.currentPage, this.itemsPerPage);
    this.p = page;
  }

  toggleNotificationSeen(notificationId: string, isSeen: boolean) {
    this.service.updateNotificationStatus(notificationId, !isSeen).subscribe(response => {
      const notification = this.Shownotification.find((notif: any) => notif._id === notificationId);
      if (notification) {
        notification.isSeen = !isSeen;
      }
    });
  }

  // Mark all notifications as seen and display only read notifications
  markAllNotificationsAsSeen() {
    this.Shownotification.forEach((notif: any) => {
      if (!notif.isSeen) {
        this.service.updateNotificationStatus(notif._id, true).subscribe(response => {
          notif.isSeen = true;  // Update the status locally after the API call
        });
      }
    });

    // Filter and show only read notifications
    this.notificationsToDisplay = this.readNotifications;  // Update the displayed notifications
  }

  // Show all notifications
  showAllNotifications() {
    this.notificationsToDisplay = this.Shownotification;  // Display all notifications
  }

  // Show only unread notifications
  showUnreadNotifications() {
    this.notificationsToDisplay = this.unreadNotifications;  // Display only unread notifications
  }
}
