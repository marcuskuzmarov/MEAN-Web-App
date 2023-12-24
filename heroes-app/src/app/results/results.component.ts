import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from '../details/details.component';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule, DetailsComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})

export class ResultsComponent {
  heroService: HeroService = inject(HeroService);
  @Input() hero!: Hero;
  selectedHero: Hero;
  showDetails: boolean = false;

  // shows details
  toggleDetails(event: Event, hero: Hero) {
    event.preventDefault();
    this.heroService.getHeroById(hero.id)
    .then((hero) => {
      this.selectedHero = hero
    })
    this.showDetails = !this.showDetails;
  }

  constructor() {}
}
