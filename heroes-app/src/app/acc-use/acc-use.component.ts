import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-acc-use',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acc-use.component.html',
  styleUrl: './acc-use.component.css'
})
export class AccUseComponent {
  policyService: PolicyService = inject(PolicyService);
  accUsePolicy = '';

  constructor(private location: Location) {}

  // gets the Acceptable Use policy from the server
  ngOnInit() {
    this.policyService.getAccUse()
    .then(res => {
      this.accUsePolicy = res.policy;
    });
  }

  // goes back to the previous page
  goBack(): void {
    this.location.back();
  }
}
