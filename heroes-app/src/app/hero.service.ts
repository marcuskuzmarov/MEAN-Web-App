import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { Hero } from './hero';
import { List } from './list';
import { Review } from './review';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  url = 'http://localhost:3000/api/superheroes'
  userService: UserService = inject(UserService);

  heroList: Hero[] = [];
  publicLists: List[] = [];
  lNames: string[] = [];
  reviewList: Review[] = [];

  // gets all hero info from the server
  async getAllHeroInfo(): Promise<Hero[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  // gets all hero info for search from the server
  async getHeroSearch(name: string, race: string, publisher: string, powers: string, limit: number): Promise<any> {
    const data = await fetch(`${this.url}/search?name=${name}&race=${race}&publisher=${publisher}&power=${powers}&limit=${limit}`);
    if (data.ok) {
      return (await data.json()) ?? [];
    } else if (data.status === 400) {
      return { status: 400, message: 'Enter at least one search term...' };
    } else {
      return [];
    }
  }

  // gets hero info by id from the server
  async getHeroById(id: number): Promise<Hero> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  // gets list names for a user
  async getListNames(): Promise<string[]> {
    const data = await fetch(`${this.url}/lists?owner=${this.userService.currentUser?.username}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return (await data.json()) ?? [];
  }

  // gets all public lists
  async getPublicLists(): Promise<any> {
    const data = await fetch(`${this.url}/lists/public`);
    return (await data.json()) ?? [];
  }

  // gets a list by name and owner
  async getList(lName: string): Promise<List> {
    const data = await fetch(`${this.url}/lists/${lName}?owner=${this.userService.currentUser?.username}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return (await data.json()) ?? {};
  }

  // gets a public list by name and owner
  async getPublicList(lName: string, owner: string): Promise<List> {
    const data = await fetch(`${this.url}/lists/${lName}?owner=${owner}`);
    return (await data.json()) ?? {};
  }

  // creates a new list
  async newList(lName: string, ids: number[], lDesc: string): Promise<any> {
    const data = await fetch(`${this.url}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ owner: this.userService.currentUser?.username, lName: lName, ids: ids, lDesc: lDesc })
    });
    return (await data.json()) ?? {};
  }

  // saves a list
  async saveList(lName: string, ids: number[], lDesc: string): Promise<List[]> {
    const data = await fetch(`${this.url}/lists/${lName}?owner=${this.userService.currentUser?.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( {lName: lName, ids: ids, lDesc: lDesc} )
    });
    return (await data.json()) ?? {};
  }

  // deletes a list
  async deleteList(lName: string): Promise<List[]> {
    const data = await fetch(`${this.url}/lists/${lName}?owner=${this.userService.currentUser?.username}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( {lName: lName} )
    });
    return (await data.json()) ?? {};
  }

  // updates a list's visibility
  async updateVisibility(lName: string): Promise<any> {
    const data = await fetch(`${this.url}/lists/${lName}?owner=${this.userService.currentUser?.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( {lName: lName, type: 'visibility'} )
    });
    return (await data.json()) ?? {};
  }

  // saves a review for a list
  async saveReview(lName: string, owner: string, rating: number, comment: string): Promise<any> {
    const data = await fetch(`${this.url}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ lName: lName, owner: owner, username: this.userService.currentUser?.username, rating: rating, comment: comment })
    });
    return (await data.json()) ?? {};
  }

  // gets reviews for a list
  async getReviews(lName: string, owner: string): Promise<Review[]> {
    const data = await fetch(`${this.url}/reviews/${lName}?owner=${owner}`);
    return (await data.json()) ?? [];
  }

  // gets all reviews
  async getAllReviews(): Promise<Review[]> {
    const data = await fetch(`${this.url}/reviews`);
    return (await data.json()) ?? [];
  }

  // toggles a review's visibility
  async toggleReview(review: Review, toggle: string): Promise<any> {
    const data = await fetch(`${this.url}/reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( { review: review, toggle: toggle } )
    });
    return (await data.json()) ?? {};
  }

  sortList(sortType: string) {
    this.heroList.sort((a, b) => {
      let textA = '';
      let textB = '';
      if (sortType === 'name') {
          textA = a.name.trim().toLowerCase();
          textB = b.name.trim().toLowerCase();
      } else if (sortType === 'powers') {
          // let aLen: number = a.powers.length;
          // let bLen: number = b.powers.length;
          // return bLen - aLen;
      } else {
          textA = a[sortType].trim().toLowerCase();
          textB = b[sortType].trim().toLowerCase();
      }
      return textA.localeCompare(textB);
    });
  }



  constructor() { }
}