import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { Child, ChildResponse } from './interfaces/Child';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  public isLoading = true;
  public kindergardens: Kindergarden[] = [];
  public children: ChildResponse[] = []
  public childrenTotalCount: number = 0;
  public isDbConnected: boolean = true;

  public kindergardenForId: Kindergarden = {} as Kindergarden;

}
