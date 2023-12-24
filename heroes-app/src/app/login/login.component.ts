import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginService: LoginService = inject(LoginService);
  userService: UserService = inject(UserService);
  errorMessages = '';
  emailAddr = '';
  emailMsg = '';
  userEmail = '';
  seconds = 7;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router,) { }

  // gets the current user from the server
  ngOnInit(): void {
    this.userService.getUser()
      .then(res => {
        this.userService.currentUser = res;
        if (res.username) {
          this.router.navigate(['/search']);
        }
      });
  }

  // logs in the user
  login() {
    this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        if (res.status === 200) {
          this.userService.currentUser = res.user;
          if (res.user.userType !== 'admin') {
            this.router.navigate(['/search']);
          } else {
            this.router.navigate(['/admin']);
          }
        } else if (res.status === 404) {
          this.errorMessages = res.message;
        } else if (res.status === 400) {
          this.errorMessages = res.message;
        } else if (res.status === 401 && res.type === 'deactive') {
          this.errorMessages = res.message;
          this.emailAddr = res.email;
          this.emailMsg = 'Click here to contact system administrator!'
        } else if (res.status === 401 && res.type === 'unconfirmed') {
          this.errorMessages = res.message;
          this.userEmail = this.loginForm.value.email;
          this.emailMsg = 'Click here to resend verification email!'
        }
      });
  }

  // resends the verification email
  resendEmail(event: Event) {
    if (this.emailMsg !== 'Click here to contact system administrator!') {
      event.preventDefault();
      this.userService.resendEmail(this.userEmail)
        .then((res) => {
          if (res.status === 200) {
            this.emailMsg = '';
            this.errorMessages = 'Please check your email! The link will expire in 10 minutes!';
          } else {
            this.errorMessages = res.message;
          }
        });
    }
  }

  // clears error messages
  clearInput() {
    this.errorMessages = '';
  }
}
