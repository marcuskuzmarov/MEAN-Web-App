import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  @Input() selectedHero!: Hero | undefined;
  showDetails: boolean = true;
  route: ActivatedRoute = inject(ActivatedRoute);
  heroService: HeroService = inject(HeroService);
  hero: Hero | undefined;

  // shows details
  ngOnChanges() {
    this.showDetails = true;
  }

  // toggles details
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  // constructor(showDetails: boolean = true) {
  //   this.showDetails = showDetails;
  // }

  // constructor() {
  //   // const heroId = parseInt(this.route.snapshot.params['id'], 10);
  //   console.log(this.selectedhero)
  //   this.heroService.getHeroById(this.selectedhero.id).then((hero) => {
  //     this.hero = hero;
  //   });
  // }
}