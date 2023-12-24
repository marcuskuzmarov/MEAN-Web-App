import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/api/users'

  userList: User[] = [];
  currentUser: User | null = null;

  // validates email
  validateEmail(email: string): boolean {
    let re = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
    if(email.match(re)) { return true }
    else { return false }
  }

  // gets all users from the server
  async getUsers(): Promise<User[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  // async getUser(username: string): Promise<User> {
  //   const data = await fetch(`${this.url}/${username}`);
  //   return (await data.json()) ?? {};
  // }

  // creates a new user
  async newUser(user: User): Promise<any> {
    const data = await fetch(`${this.url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { username: user.username, email: user.email, password: user.password}),
    });
    return (await data.json()) ?? {};
  }

  // logs in a user
  async login(email: string, password: string): Promise<any> {
    const data = await fetch(`${this.url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( { email: email, password: password } )
    });
    return (await data.json()) ?? {};
  }

  // logs out a user
  async logout(): Promise<any> {
    const data = await fetch(`${this.url}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return (await data.json()) ?? {};
  }

  // gets the current user from the server
  async getUser(): Promise<User> {
    const data = await fetch(`${this.url}/user`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return (await data.json()) ?? {};
  }

  // updates characteristics of a user
  async toggleUser(user: User, toggle: string): Promise<any> {
    const data = await fetch(`${this.url}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( { user: user, toggle: toggle } )
    });
    return (await data.json()) ?? {};
  }

  // updates characteristics of a user
  async toggleActive(user: User, currentUser: User): Promise<any> {
    const data = await fetch(`${this.url}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( { user: user } )
    });
    return (await data.json()) ?? {};
  }

  // updates user's password
  async updatePass(password: string) {
    const data = await fetch(`${this.url}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify( { password: password } )
    });
  }

  async resendEmail(email: string): Promise<any> {
    const data = await fetch(`${this.url}/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email: email } )
    });
    return (await data.json()) ?? {};
  }

  constructor() { }
}
