import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-pass',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.css'
})
export class UpdatePassComponent {
  userService: UserService = inject(UserService);


  updatePassForm: FormGroup = new FormGroup({
    password: new FormControl(''),
    confPass: new FormControl('')
  });

  // updates the user's password
  updatePass() {
    this.userService.updatePass(this.updatePassForm.value.password)
    this.router.navigate(['/']);
  }

  constructor(private router: Router,) {}
}
