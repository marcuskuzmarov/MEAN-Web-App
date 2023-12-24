import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ListComponent } from '../list/list.component';
import { ResultsComponent } from '../results/results.component';
import { DetailsComponent } from '../details/details.component';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, SearchComponent, ListComponent, ResultsComponent, DetailsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  heroService: HeroService = inject(HeroService);

  // gets all hero info from the server
  constructor() {
    this.heroService.getAllHeroInfo().then((heroList: Hero[]) => {
      this.heroService.heroList = heroList;
      this.heroService.sortList('name');
    });
  }
}
