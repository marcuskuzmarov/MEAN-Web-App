import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  url = 'http://localhost:3000/api/policy';

  // gets the Privacy policy from the server
  async getPrivacy(): Promise<any> {
    const data = await fetch(`${this.url}/privacy`);
    return (await data.json()) ?? '';
  }

  // gets the DMCA policy from the server
  async getDMCA(): Promise<any> {
    const data = await fetch(`${this.url}/dmca`);
    return (await data.json()) ?? '';
  }

  // gets the Acceptable Use policy from the server
  async getAccUse(): Promise<any> {
    const data = await fetch(`${this.url}/acc-use`);
    return (await data.json()) ?? '';
  }

  // submits a DMCA report to the server
  async submitDCMA(report: any): Promise<any> {
    const data = await fetch(`${this.url}/dmca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report: report })
    });
    return (await data.json()) ?? '';
  }

  // gets all DMCA reports for a review
  async getDMCAReports(lName: string, owner: string, username: string): Promise<any> {
    const data = await fetch(`${this.url}/dmca-notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lName: lName, owner: owner, username: username })
    });
    return (await data.json()) ?? '';
  }

  // updates the privacy policy
  async updatePrivacy(policy: string): Promise<any> {
    const data = await fetch(`${this.url}/privacy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy: policy })
    });
    return (await data.json()) ?? '';
  }

  // updates the DMCA policy
  async updateDMCA(policy: string): Promise<any> {
    const data = await fetch(`${this.url}/dmca`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy: policy })
    });
    return (await data.json()) ?? '';
  }

  // updates the Acceptable Use policy
  async updateAccUse(policy: string): Promise<any> {
    const data = await fetch(`${this.url}/acc-use`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy: policy })
    });
    return (await data.json()) ?? '';
  }

  constructor() { }
}
