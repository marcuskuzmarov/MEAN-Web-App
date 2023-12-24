import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  userService: UserService = inject(UserService);
  errorMessages = '';
  seconds = 7;

  constructor(private router: Router) {}

  // gets the current user from the server
  ngOnInit(): void {
    this.userService.getUser()
    .then(user => {
      if(user.username) {
        this.userService.currentUser = user;
        this.router.navigate(['/search']);
      }
    });
  }

  createAccountForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
    confPass: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
  });

  // creates a new user
  createAccount(): void {
    let user = this.createAccountForm.getRawValue();
    this.userService.newUser(user)
    .then((res) => {
      if (res.status === 200) {
        const coundown = setInterval(() => {
          this.seconds--;
          if(this.seconds === 0) {
            clearInterval(coundown);
            this.router.navigate(['/']);
          }
        }, 1000);
        this.errorMessages = 'Please check your email to verify your account! The link will expire in 10 minutes! Redirecting to home page shortly';
      } else {
        this.errorMessages = res.message;
      }
    })
  }

  // clears the error messages
  clearInput() {
    this.errorMessages = '';
  }
}


