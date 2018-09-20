import { Component, OnInit } from '@angular/core';
import {VialsService} from '../vials.service';

@Component({
  selector: 'app-vials-to-plates',
  templateUrl: './vials-to-plates.component.html',
  styleUrls: ['./vials-to-plates.component.css']
})
export class VialsToPlatesComponent implements OnInit {
  vialsColumnDefs = [
    {headerName: 'Vial Name', field: 'vialName' },
    {headerName: '2D Barcode', field: 'twoDBarcode' },
    {headerName: 'Molecule Name', field: 'molName' },
    {headerName: 'Batch Name', field: 'batchName' },
    {headerName: 'Catalog', field: 'catalog' },
    {headerName: 'Supplier', field: 'supplier' },
    {headerName: 'Supplier MW', field: 'supplierMW'},
    {headerName: 'Initial Quantity[mg]', field: 'initialQuantity'},
    {headerName: 'Comment', field: 'comment'},
    {headerName: 'Location', field: 'location'},
  ];

  vialsRowData = [
    { vialName: 'PCM-0087138-001', twoDBarcode: '', molName: 'PCM-0087138', batchName: 1, catalog: 'NP-003824', supplier: 'Analyticon',
      supplierMW: 275.29, initialQuantity: 55, comment: 'Some comment', location: 'CB_Box10' },
    { vialName: 'PCM-0087158-001', twoDBarcode: '', molName: 'PCM-0087158', batchName: 1, catalog: 'NP-003411', supplier: 'Analyticon',
      supplierMW: 480.37, initialQuantity: 65, comment: '', location: 'CB_Box11' },
    { vialName: 'PCM-0065541-001', twoDBarcode: '', molName: 'PCM-0065541', batchName: 1, catalog: 'NP-010620', supplier: 'Maybridge Ltd',
      supplierMW: 410.95, initialQuantity: 75, comment: 'Life, the Universe, and Everything', location: 'CB_Box12' }
  ];

  inventoryColumnDefs = [
    {headerName: 'Location', field: 'location' },
    {headerName: 'Parent', field: 'parent' },
    {headerName: 'Type', field: 'type' }
  ];

  inventoryRowData = [];

  constructor( private vialsService: VialsService) { }

  ngOnInit() {
    this.vialsService.linkSelected.next('From vial to plate');
  }

}
