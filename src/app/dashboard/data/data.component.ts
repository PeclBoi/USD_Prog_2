import { Component, EventEmitter, Input, OnInit, ViewChild, Output } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Kindergarden } from 'src/app/shared/interfaces/Kindergarden';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de-AT';
import { Router } from '@angular/router';

registerLocaleData(localeDe);

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})


export class DataComponent implements OnInit {
  
  constructor(private router: Router, public storeService: StoreService, private backendService: BackendService) { }
  
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public page: number = 0;

  length = 0;
  pageSize = CHILDREN_PER_PAGE;
  pageIndex = 0;


  selectedSort = "name"
  selectedKindergarten = ""
  
  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;


  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Kinder pro Seite";
    this.paginator._intl.firstPageLabel = "Erste Seite";
    this.paginator._intl.previousPageLabel = "Vorherige";
    this.paginator._intl.nextPageLabel = "Nächste";
    this.paginator._intl.lastPageLabel = "Letzte Seite";
  }

  filterTable() {
    this.backendService.getChildren(this.currentPage, this.selectedSort, this.selectedKindergarten);
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageIndex = e.pageIndex;
    this.selectPage(this.pageIndex + 1);
  }

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage);
    console.log(this.storeService.children)
  }


  loadDetailPage(id: number) {
      this.router.navigate(['/kindergarten/' + id])
  }

  getAge(birthDate: string) {
    this.length = this.storeService.childrenTotalCount;
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
      age--;
    }
    return age;
  }

  selectPage(i: any) {
    let currentPage = i;
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage, this.selectedSort, this.selectedKindergarten);
  }

  public returnAllPages() {
    let res = [];
    this.length = this.storeService.childrenTotalCount;
    const pageCount = Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId, this.currentPage);
  }
}


