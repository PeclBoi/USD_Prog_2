import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { Toast } from 'bootstrap'; // Import the Toast class from Bootstrap

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})

export class AddDataComponent implements OnInit {

  minDate: Date;
  maxDate: Date;

  constructor(
    private formbuilder: FormBuilder,
    public storeService: StoreService,
    public backendService: BackendService
  ) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear() - 3, 0, 1);
    this.maxDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
  }

  @Input() currentPage!: number;
  public addChildForm: any;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required]
    });

    
    
  }
  
  onSubmit() {
    if (this.addChildForm.valid) {
      console.log(this.currentPage);
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      
      const toastLiveExample = document.getElementById('liveToast');
      if (toastLiveExample) {
        const toastBootstrap = new Toast(toastLiveExample);
        toastBootstrap.show();
      }
    }
  }
}
