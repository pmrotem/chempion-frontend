import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VialsService} from '../vials.service';
import {PapaParseService} from 'ngx-papaparse';
import {GridApi} from 'ag-grid';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FileManagerService} from '../../shared/file-manager.service';
import {MessageHandler} from '../../shared/message-handler';
import {VialsFeedbackGrid} from './vials-feedback-grid';
import {Feedback} from '../../shared/feedback';
import {RequiredValidator} from '../../shared/validators';

@Component({
  selector: 'app-register-vials',
  templateUrl: './register-vials.component.html',
  styleUrls: ['./register-vials.component.css']
})
export class RegisterVialsComponent implements OnInit {
  constructor(private route:ActivatedRoute, private vialsService: VialsService, private papa: PapaParseService,
              private httpClient: HttpClient, private renderer: Renderer2, private fileManager: FileManagerService) { }

  type: string = null;
  locationTypes: string[] = [];
  messageHandler: MessageHandler = new MessageHandler();
  initGridInterval;

  ngOnInit() {
    // check which register vials type it is:
    this.route.data.subscribe(
      (data) => {
        this.type =  data['type'];
        if (this.type === 'dry') {
          this.vialsService.linkSelected.next('Register dry vials');
        } else {
          this.vialsService.linkSelected.next('Register dilution vials');
        }
      }
    );
    // get location types:
    this.httpClient.get('/cm/location_types_query/').subscribe(
      (data: string[]) => {
        console.log('success');
        console.log(data);
        this.locationTypes = data;
      },
      (error) =>  {
        console.log('error');
        console.log(error);
        this.messageHandler.addError('failed getting location types - ' + error.message);
      }
    );
  }


// Vials grid:
  vialsColumnDefs = [
    {headerName: 'Vial Name', field: 'Vial Name', checkboxSelection: true},
    {headerName: 'Molecule Name', field: 'Molecule Name'},
    {headerName: 'Batch Name', field: 'Batch Name'},
    {headerName: 'Catalog', field: 'Catalog'},
    {headerName: 'Supplier', field: 'Supplier'},
    {headerName: 'Supplier MW', field: 'Supplier MW'},
    {headerName: 'Quantity[mg]', field: 'Quantity[mg]'},
    {headerName: 'Comment', field: 'Comment'},
    {headerName: 'Location', field: 'Location'},
  ];
  vialsValidators = {
    'Vial Name': [new RequiredValidator()],
    'Molecule Name': [new RequiredValidator()],
    'Batch Name': [new RequiredValidator()],
    'Supplier MW': [new RequiredValidator()],
    'Quantity[mg]': [new RequiredValidator()],
  };
  vialsRowData = [];
  rowSelection = "multiple";
  vialsDefaultColDef = { editable: true};


  // Inventory grid:
  isLocationEditable = (params) => {
    return (params.data['New'] === 'Yes');
  };

  disabledLocationClass = (params) => {
    if(params.data['New'] !== undefined && params.data['New'] === 'No') {
      return 'disabled'
    }
  };
  inventoryColumnDefs = [
    {headerName: 'Location', field: 'Location', editable: false, cellClass: this.disabledLocationClass},
    {headerName: 'Parent', field: 'Parent', editable: this.isLocationEditable, cellClass: this.disabledLocationClass},
    {headerName: 'Type', field: 'Type', editable: this.isLocationEditable, cellClass: this.disabledLocationClass, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.locationTypes
        }}},
    {headerName: 'New?', field: 'New', editable: false, cellClass: this.disabledLocationClass},
  ];
  inventoryRowData = [];

  feedbackGrid: VialsFeedbackGrid = new VialsFeedbackGrid(this.vialsColumnDefs, this.inventoryColumnDefs, this.vialsValidators, this.httpClient, this.papa, this.fileManager, this.messageHandler);

}
