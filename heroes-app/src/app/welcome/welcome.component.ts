import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  userService: UserService = inject(UserService);
  message: string = '';
  
  // constructor() {
  //   this.userService.getUser()
  //   .then(res => {
  //     this.message = `Welcome ${res.username}!`;
  //   }, err => {
  //     this.message = 'You are not logged in! Please login or create an account!';
  //   });
  // }

  constructor(private router: Router) {}

  // gets the current user from the server
  ngOnInit(): void {
    this.userService.getUser()
    .then(user => {
      if(user.username === undefined) {
        this.message = 'You are not logged in!<br>Please login or create an account!';
      } else {
        this.userService.currentUser = user;
        this.message = `Welcome ${user.username}!<br>Click below to start!`;
      }
    });
  }

  // redirects to the appropriate page
  start() {
    if(this.userService.currentUser?.userType !== 'admin') {
      this.router.navigate(['/search']);
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
