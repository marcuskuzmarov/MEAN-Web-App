import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeroService } from '../hero.service';
import { UserService } from '../user.service';
import { SearchComponent } from '../search/search.component';
import { Hero } from '../hero';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  heroService: HeroService = inject(HeroService);
  userService: UserService = inject(UserService);
  searchComponent: SearchComponent = inject(SearchComponent);
  lNames = this.heroService.lNames;
  listPublic: boolean = false;
  selectedList: string = '';
  confDel: boolean = false;

  listForm: FormGroup = new FormGroup({
    lName: new FormControl(),
    lDesc: new FormControl(),
    listDrop: new FormControl(),
    sortDrop: new FormControl(),
    // name : new FormControl(''),
    // race : new FormControl(''),
    // publisher : new FormControl(''),
    // powers : new FormControl(''),
  });

  // initializes the list form
  ngOnInit(): void {
    this.popDrop();
    this.listForm.get('listDrop')?.valueChanges.subscribe((value) => {
      this.listPublic = value === 'Select A List' ? false : true;
    });
  }

  //gets all list info
  popDrop() {
    this.listForm.setValue({lName: '', lDesc: '',listDrop: 'Select A List', sortDrop: 'Sort By'});
    if (this.userService.currentUser) {
      this.heroService.getListNames().then((listNames: string[]) => {
        this.lNames = listNames;
      });
    }
    this.heroService.getPublicLists()
    .then((lists) => {
      this.heroService.publicLists = lists;
    });
  }

  sortResults() {

  }

  // toggles the delete confirmation
  chooseDelete() {
    this.confDel = !this.confDel;
  }

  // deletes a list
  async deleteList() {
    await this.heroService.deleteList(this.listForm.value.listDrop ?? '');
    this.confDel = false;
    this.listForm.setValue({ lName: '', lDesc: '', listDrop: 'Select A List', sortDrop: 'Sort By' });
    this.searchComponent.matchMsg = '';
    this.searchComponent.publicForm.setValue({ listDrop: 'Select A List' });
    this.popDrop();
  }

  // saves a list
  async saveList() {
    await this.heroService.saveList(this.listForm.value.listDrop ?? '', this.heroService.heroList.map((hero: Hero) => hero.id), this.listForm.value.lDesc ?? '');
    this.heroService.getPublicLists()
    .then((lists) => {
      this.heroService.publicLists = lists;
    });
    this.listForm.setValue({lName: '', lDesc: '', listDrop: 'Select A List', sortDrop: 'Sort By'});
    this.searchComponent.matchMsg = '';
  }

  // gets a list
  getList() {
    this.heroService.getList(this.listForm.value.listDrop ?? '').then((list) => {
      this.listPublic = list.public;
      this.selectedList = list.lName;
      const listHeroes: Hero[] = [];
      list.ids.forEach((id: number) => {
        this.heroService.getHeroById(id).then((hero: Hero) => {
          listHeroes.push(hero);
        });
      });
      this.heroService.heroList = listHeroes;
      if(list.lDesc === '') this.searchComponent.matchMsg = 'No Description';
      else this.searchComponent.matchMsg = `Description: ${list.lDesc}`;
      this.searchComponent.reviews = [];
      this.searchComponent.publicForm.setValue({ listDrop: 'Select A List' });
    });
  }

  // creates a new list
  async newList() {
    this.heroService.newList(this.listForm.value.lName ?? '', this.heroService.heroList.map((hero: Hero) => hero.id), this.listForm.value.lDesc ?? '')
    .then((res) => {
      if (res.status !== 200) this.searchComponent.matchMsg = res.message;
      this.popDrop();
    })

  }

  // updates the visibility of a list
  async updateVisibility() {
    await this.heroService.updateVisibility(this.selectedList)
    .then((res) => {
      if (res.status !== 200) this.searchComponent.matchMsg = res.message;
      else this.heroService.getPublicLists()
      .then((lists) => this.heroService.publicLists = lists);
      this.searchComponent.publicForm.setValue({ listDrop: 'Select A List' });
    })
  }
}
