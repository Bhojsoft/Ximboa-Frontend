import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navListVisible = false;
  activeLink = '';

  toggleNavList() {
    this.navListVisible = !this.navListVisible;
  }

  setActive(link: string) {
    this.activeLink = link;
    this.navListVisible = false; // Hide nav list after clicking a link
  }
  menuVariable:boolean=false;
  menu_icon_Variable:boolean=false;
  openMenu(){
    this.menuVariable =! this.menuVariable;
    this.menu_icon_Variable =! this.menu_icon_Variable;
  }

  closeMenu(){
    setTimeout(() => {
      this.menuVariable = !this.menuVariable;
      this.menu_icon_Variable = !this.menu_icon_Variable;
    }, 300); // 3000 milliseconds = 3 seconds
  }


}
