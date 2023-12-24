import { Component,inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent {
  privacyPolicy = '';
  policyService: PolicyService = inject(PolicyService);

  constructor(private location: Location) {}

  // gets the Privacy policy from the server
  ngOnInit() {
    this.policyService.getPrivacy()
    .then(res => {
      this.privacyPolicy = res.policy;
    });
  }

  // goes back to the previous page
  goBack(): void {
    this.location.back();
  }
}
