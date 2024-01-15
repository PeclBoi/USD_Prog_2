import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { CHILDREN_PER_PAGE } from './constants';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens')
      .pipe(
        catchError(error => {
          console.error('Error fetching kindergardens:', error);
          this.storeService.isDbConnected = false;
          return throwError(() => 'Something went wrong. Please try again later.');
        })
      )
      .subscribe(data => {
        this.storeService.kindergardens = data;
        this.storeService.isDbConnected = true;
      });
  }

  public getKindergardenById(kindergardenId: string) {
    this.storeService.isLoading = true;
    this.http.get<Kindergarden>(`http://localhost:5000/kindergardens/${kindergardenId}`).subscribe(data => {
      this.storeService.kindergardenForId = data;
      this.storeService.isLoading = false;
    });
  }

  public getChildren(page: number, selectedSort: string = "name", selectedKindergarten: string = "") {
    this.storeService.isLoading = true;

    let order: string = "asc"
    if (selectedSort.includes("signUpDate")) {
      if (selectedSort.includes("DESC")) {
        order = "desc"
      }
      selectedSort = "signUpDate"
    }

    let queryParams = `?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`;

    if (selectedSort) {
      queryParams += `&_sort=${selectedSort}&_order=${order}`;
    }
    
    if (selectedKindergarten) {
      console.log(selectedKindergarten);
      queryParams += `&kindergardenId=${encodeURIComponent(selectedKindergarten)}`;
    }

    console.log(queryParams);
    this.http.get<ChildResponse[]>(`http://localhost:5000/childs${queryParams}`, { observe: 'response' })
      .pipe(
        catchError(error => {
          console.error('Error fetching children:', error);
          this.storeService.isLoading = false;
          this.storeService.isDbConnected = false
          return throwError(() => 'Something went wrong. Please try again later.');
        })
      )
      .subscribe(data => {
        this.storeService.children = data.body!;
        this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
        this.storeService.isLoading = false;
        this.storeService.isDbConnected = true;

      });
  }

  public addChildData(child: Child, page: number) {
    this.storeService.isLoading = true;
    this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
      this.getChildren(page);
      this.storeService.isLoading = false;
    })
  }

  public deleteChildData(childId: string, page: number) {
    this.storeService.isLoading = true;
    this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_ => {
      this.getChildren(page);
      this.storeService.isLoading = false;
    })
  }
}
