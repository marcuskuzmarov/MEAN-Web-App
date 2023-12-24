import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-dmca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dmca.component.html',
  styleUrl: './dmca.component.css'
})
export class DmcaComponent {
  policyService: PolicyService = inject(PolicyService);
  dmcaPolicy = '';

  constructor(private location: Location) {}

  // gets the DMCA policy from the server
  ngOnInit() {
    this.policyService.getDMCA()
    .then(res => {
      this.dmcaPolicy = res.policy;
    });
  }

  // goes back to the previous page
  goBack(): void {
    this.location.back();
  }
}
