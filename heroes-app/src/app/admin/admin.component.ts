import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from '../user/user.component';
import { ReviewComponent } from '../review/review.component';
import { UserService } from '../user.service';
import { HeroService } from '../hero.service';
import { PolicyService } from '../policy.service';
import { UserReviewsComponent } from '../user-reviews/user-reviews.component';
import { get } from 'http';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, UserComponent, ReviewComponent, UserReviewsComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userService: UserService = inject(UserService);
  heroService: HeroService = inject(HeroService);
  policyService: PolicyService = inject(PolicyService);
  reviewList: any;
  dmcaReports: any[] = [];
  showReviews: boolean = false;
  showUsers: boolean = false;
  showPriv: boolean = false;
  showDMCA: boolean = false;
  showAccUse: boolean = false;
  privPol: string;
  dmcaPol: string;
  accUsePol: string;

  dmcaForm: FormGroup = new FormGroup({
    reviewDrop: new FormControl('Select A Review'),
    dateReqRcvd: new FormControl(),
    dateNotSent: new FormControl(),
    dateDisRcvd: new FormControl(),
    notes: new FormControl(),
    status: new FormControl('Active'),
  });

  constructor(private router: Router) {}

  // gets the current user from the server
  ngOnInit(): void {
    this.userService.getUser()
    .then(user => {
      this.userService.currentUser = user;
      if (user.userType !== 'admin') {
        this.router.navigate(['/search']);
      } else {
        this.dmcaForm.setValue({reviewDrop: 'Select A Review', dateReqRcvd: '', dateNotSent: '', dateDisRcvd: '', notes: '', status: 'Active'});
        this.userService.getUsers()
        .then(res => {
          this.userService.userList = res;
        })
        this.heroService.getAllReviews()
        .then(res => this.reviewList = res);

      }
    });
  }

  // submits a dmca report
  async submitDMCA() {
    const dmca = this.dmcaForm.get('reviewDrop')?.value.split(',');
    const dmcaObj = {
      lName: dmca[0],
      owner: dmca[1],
      username: dmca[2],
      dateReqRcvd: this.dmcaForm.get('dateReqRcvd')?.value,
      dateNotSent: this.dmcaForm.get('dateNotSent')?.value,
      dateDisRcvd: this.dmcaForm.get('dateDisRcvd')?.value,
      notes: this.dmcaForm.get('notes')?.value,
      status: this.dmcaForm.get('status')?.value,
    }
    this.policyService.submitDCMA(dmcaObj);
    this.dmcaForm.setValue({reviewDrop: 'Select A Review', dateReqRcvd: '', dateNotSent: '', dateDisRcvd: '', notes: '', status: 'Active'});
  }

  // gets the dmca reports for a review
  getDMCAReports() {
    const dmca = this.dmcaForm.get('reviewDrop')?.value.split(',');
    this.policyService.getDMCAReports(dmca[0], dmca[1], dmca[2])
    .then(res => {
      if(res.status === 404) this.dmcaReports = [];
      else this.dmcaReports = res;
    });
  }

  // shows users
  toggleUsers() {
    this.showUsers = !this.showUsers;
    this.showReviews = false;
    this.showPriv = false;
    this.showDMCA = false;
    this.showAccUse = false;
  }

  // shows reviews
  toggleReviews() {
    this.heroService.getAllReviews()
    .then(res => {
      console.log(res)
      this.heroService.reviewList = res;
    });
    this.showReviews = !this.showReviews;
    this.showUsers = false;
    this.showPriv = false;
    this.showDMCA = false;
    this.showAccUse = false;
  }

  // shows privacy policy
  togglePriv() {
    this.policyService.getPrivacy()
    .then(res => {
      console.log(res);
      this.privPol = res.policy;
    });
    // this.policyService.showPriv = !this.policyService.showPriv;
    this.showPriv = !this.showPriv;
    this.showUsers = false;
    this.showReviews = false;
    this.showDMCA = false;
    this.showAccUse = false;
  }

  // shows dmca policy
  toggleDMCA() {
    this.policyService.getDMCA()
    .then(res => {
      console.log(res);
      this.dmcaPol = res.policy;
    });
    this.showDMCA = !this.showDMCA;
    this.showUsers = false;
    this.showReviews = false;
    this.showPriv = false;
    this.showAccUse = false;
  }
  
  // shows acceptable use policy
  toggleAccUse() {
    this.policyService.getAccUse()
    .then(res => {
      console.log(res);
      this.accUsePol = res.policy;
    });
    this.showAccUse = !this.showAccUse;
    this.showUsers = false;
    this.showReviews = false;
    this.showPriv = false;
    this.showDMCA = false;
  }

  // updates the privacy policy
  updatePriv() {
    this.policyService.updatePrivacy(this.privPol)
    .then(res => {
      console.log(res);
    });
  }
  
  // updates the dmca policy
  updateDMCA() {
    this.policyService.updateDMCA(this.dmcaPol)
    .then(res => {
      console.log(res);
    });
  }

  // updates the acceptable use policy
  updateAccUse() {
    console.log(this.accUsePol);
    this.policyService.updateAccUse(this.accUsePol)
    .then(res => {
      console.log(res);
    });
  }

  // logs out admin
  logout() {
    this.userService.logout()
    .then(res => {
      if (res.status === 200) {
        this.userService.currentUser = null;
        this.router.navigate(['/']);
      }    
    })
  }
}
