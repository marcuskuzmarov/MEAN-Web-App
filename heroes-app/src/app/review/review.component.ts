import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeroService } from '../hero.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  heroService: HeroService = inject(HeroService);
  searchComponent: SearchComponent = inject(SearchComponent);
  reviewMsg = '';

  reviewForm: FormGroup = new FormGroup({
    rating: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(5)
    ]),
    review: new FormControl(),
  });

  // saves a review
  saveReview() {
    const rating = this.reviewForm.get('rating')?.value;
    const comment = this.reviewForm.get('review')?.value;
    const listValue = this.searchComponent.publicForm.value.listDrop.split(',');
    this.heroService.saveReview(listValue[0], listValue[1], rating, comment)
    .then((res) => {
      if(res.status !== 200) this.reviewMsg = res.message;
      else {
        // this.searchComponent.publicForm.setValue({listDrop: 'Select A List'});
        // this.searchComponent.popDrop()
        this.heroService.getPublicLists()
        .then(lists => { 
          this.heroService.publicLists = lists;
        })
        this.heroService.getReviews(listValue[0], listValue[1])
        .then(reviews => {
          this.heroService.reviewList = reviews;
        })
        this.reviewForm.setValue({rating: '', review: ''});
      }
    })
  }

  // validates the rating
  validateRating() {
    const ratingControl = this.reviewForm.get('rating');
    let rating = ratingControl?.value;
  
    if (rating < 1) {
      ratingControl?.setValue(0);
    } else if (rating > 5) {
      ratingControl?.setValue(5);
    }
  }
}
