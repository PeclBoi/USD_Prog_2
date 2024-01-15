import { Component, OnInit } from '@angular/core';
import { StoreService } from '../shared/store.service';
import { BackendService } from '../shared/backend.service';
import { Kindergarden } from '../shared/interfaces/Kindergarden';

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {


  constructor(public storeService: StoreService, private backendService: BackendService) { }


  ngOnInit(): void {

    var url = window.location.pathname;
    var parts = url.split('/');
    var id = parts[parts.length - 1];
    
    this.backendService.getKindergardenById(id)
  }

}
