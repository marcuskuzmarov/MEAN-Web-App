import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userService: UserService = inject(UserService);
  @Input() user!: User;

  // toggles admin status for user
  toggleAdmin(): void {
    this.userService.toggleUser(this.user, 'admin')
      .then(res => {
        if (res.status === 200) {}
      });
  }

  // toggles active status for user
  toggleActive(): void {
    this.userService.toggleUser(this.user, 'active')
      .then(res => {
        if (res.status === 200) {}
      });
  }

}
