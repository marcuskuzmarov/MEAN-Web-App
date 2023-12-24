import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Hero } from '../hero';
import { List } from '../list';
import { HeroService } from '../hero.service';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from '../list/list.component';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ListComponent, ReviewComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  heroService: HeroService = inject(HeroService);
  userService: UserService = inject(UserService);
  heroList = this.heroService.heroList;
  // lists = this.heroService.lists;
  lNames = this.heroService.lNames;
  publicLNames = this.heroService.publicLists;
  errorMessages = '';
  matchMsg = '';
  logoutText = '';
  reviews = this.heroService.reviewList;

  searchForm: FormGroup = new FormGroup({
    searchName: new FormControl(''),
    searchRace: new FormControl(''),
    searchPublisher: new FormControl(''),
    searchPowers: new FormControl('None'),
    searchLimit: new FormControl(),
  });

  publicForm: FormGroup = new FormGroup({
    listDrop: new FormControl(),
    // name : new FormControl(''),
    // race : new FormControl(''),
    // publisher : new FormControl(''),r
    // powers : new FormControl(''),
  });

  constructor(private router: Router) {
    // console.log(this.userService.loggedIn)

  }

  // gets all public lists
  getPublicList() {
    const publicList = this.publicForm.get('listDrop')?.value.split(',');
    const listHeroes: Hero[] = [];
    this.heroService.getPublicList(publicList[0], publicList[1])
    .then((list: List) => {
      list.ids.forEach((id: number) => {
        if(list.lDesc === '') this.matchMsg = 'No Description';
        else this.matchMsg = `Description: ${list.lDesc}`;
        this.heroService.getHeroById(id)
        .then((hero: Hero) => {
          listHeroes.push(hero);
        });
      });
      this.heroService.heroList = listHeroes;
    });
    this.heroService.getReviews(publicList[0], publicList[1])
    .then((res) => {
      this.heroService.reviewList = res;
    });
    // this.listComponent.listForm.setValue({lName: '', lDesc: '',listDrop: 'Select A List'});


    // this.heroService.getPublicList(listDrop.value, listDrop.class);
  }

  // initializes the component
  ngOnInit(): void {
    this.publicForm.get('listDrop')?.setValue('Select A List');
    this.userService.getUser()
      .then(user => {
        // console.log(user)
        if (user.active) {
          this.userService.currentUser = user;
        } else {
          this.userService.currentUser = null;
        }
        this.popDrop();
      });
  }

  sortResults() {
    this.heroService.sortList(this.publicForm.value.sortDrop);
  }

  // gets all list info
  popDrop() {
    // this.publicForm.setValue({ listDrop: 'Select A List' });
    // this.searchForm.value.searchPowers = 'Select A Power';
    if (this.userService.currentUser) {
      this.heroService.getListNames().then((listNames: string[]) => {
        this.lNames = listNames;
      });
      this.logoutText = 'Logout';
    } else {
      this.logoutText = 'Back';
    }
    this.heroService.getPublicLists().then((lists) => {
      this.heroService.publicLists = lists;
    });
  }

  // submit search
  submitSearch() {
    let searchPowers = this.searchForm.value.searchPowers;
    if (searchPowers == 'None') {
      searchPowers = '';
    }
    this.heroService.getHeroSearch(
      this.searchForm.value.searchName,
      this.searchForm.value.searchRace,
      this.searchForm.value.searchPublisher,
      searchPowers,
      this.searchForm.value.searchLimit,
    ).then((heroList) => {
      if(heroList.status === 400) this.matchMsg = heroList.message;
      this.heroService.heroList = heroList;
      if(this.heroService.heroList.length === 0) this.matchMsg = 'No Matches!';
    });
  }

  // logs out the user
  logout() {
    this.userService.logout()
      .then((res) => {
        if (res.message == 'success...') {
          this.userService.currentUser = null;
          this.router.navigate(['/']);
        } else {
          this.errorMessages = res.message;
        }
      });
  }

  // list of superpowers
  powersList = [
    "Agility", "Accelerated Healing", "Lantern Power Ring", "Dimensional Awareness", "Cold Resistance",
    "Durability", "Stealth", "Energy Absorption", "Flight", "Danger Sense",
    "Underwater breathing", "Marksmanship", "Weapons Master", "Power Augmentation", "Animal Attributes",
    "Longevity", "Intelligence", "Super Strength", "Cryokinesis", "Telepathy",
    "Energy Armor", "Energy Blasts", "Duplication", "Size Changing", "Density Control",
    "Stamina", "Astral Travel", "Audio Control", "Dexterity", "Omnitrix",
    "Super Speed", "Possession", "Animal Oriented Powers", "Weapon-based Powers", "Electrokinesis",
    "Darkforce Manipulation", "Death Touch", "Teleportation", "Enhanced Senses", "Telekinesis",
    "Energy Beams", "Magic", "Hyperkinesis", "Jump", "Clairvoyance",
    "Dimensional Travel", "Power Sense", "Shapeshifting", "Peak Human Condition", "Immortality",
    "Camouflage", "Element Control", "Phasing", "Astral Projection", "Electrical Transport",
    "Fire Control", "Projection", "Summoning", "Enhanced Memory", "Reflexes",
    "Invulnerability", "Energy Constructs", "Force Fields", "Self-Sustenance", "Anti-Gravity",
    "Empathy", "Power Nullifier", "Radiation Control", "Psionic Powers", "Elasticity",
    "Substance Secretion", "Elemental Transmogrification", "Technopath/Cyberpath", "Photographic Reflexes", "Seismic Power",
    "Animation", "Precognition", "Mind Control", "Fire Resistance", "Power Absorption",
    "Enhanced Hearing", "Nova Force", "Insanity", "Hypnokinesis", "Animal Control",
    "Natural Armor", "Intangibility", "Enhanced Sight", "Molecular Manipulation", "Heat Generation",
    "Adaptation", "Gliding", "Power Suit", "Mind Blast", "Probability Manipulation",
    "Gravity Control", "Regeneration", "Light Control", "Echolocation", "Levitation",
    "Toxin and Disease Control", "Banish", "Energy Manipulation", "Heat Resistance", "Natural Weapons",
    "Time Travel", "Enhanced Smell", "Illusions", "Thirstokinesis", "Hair Manipulation",
    "Illumination", "Omnipotent", "Cloaking", "Changing Armor", "Power Cosmic",
    "Biokinesis", "Water Control", "Radiation Immunity", "Vision - Telescopic", "Toxin and Disease Resistance",
    "Spatial Awareness", "Energy Resistance", "Telepathy Resistance", "Molecular Combustion", "Omnilingualism",
    "Portal Creation", "Magnetism", "Mind Control Resistance", "Plant Control", "Sonar",
    "Sonic Scream", "Time Manipulation", "Enhanced Touch", "Magic Resistance", "Invisibility",
    "Sub-Mariner", "Radiation Absorption", "Intuitive aptitude", "Vision - Microscopic", "Melting",
    "Wind Control", "Super Breath", "Wallcrawling", "Vision - Night", "Vision - Infrared",
    "Grim Reaping", "Matter Absorption", "The Force", "Resurrection", "Terrakinesis",
    "Vision - Heat", "Vitakinesis", "Radar Sense", "Qwardian Power Ring", "Weather Control",
    "Vision - X-Ray", "Vision - Thermal", "Web Creation", "Reality Warping", "Odin Force",
    "Symbiote Costume", "Speed Force", "Phoenix Force", "Molecular Dissipation", "Vision - Cryo",
    "Omnipresent", "Omniscient"
  ];
}
