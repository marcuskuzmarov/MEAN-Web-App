import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.css'
})
export class UserReviewsComponent {
  @Input() review!: any;
  heroService: HeroService = inject(HeroService);

  // toggles visible status for review
  toggleVisible(): void {
    this.heroService.toggleReview(this.review, 'visible')
      .then((res) => {
        if (res.status === 200) {}
      });
  }
}
