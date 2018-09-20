import {HttpClient, HttpParams} from '@angular/common/http';
import {MessageHandler} from '../../shared/message-handler';
import {GridApi} from 'ag-grid';
import {PapaParseService} from 'ngx-papaparse';
import {FileManagerService} from '../../shared/file-manager.service';
import {Feedback} from '../../shared/feedback';

export class VialsFeedbackGrid {
  constructor(private vialsColumnDefs, private inventoryColumnDefs, private vialsValidators, private httpClient: HttpClient, private papa: PapaParseService, private fileManager: FileManagerService, private messageHandler: MessageHandler) {
  }
  locationsData = [];
  vialsData = [];
  inventoryFeedback : Feedback = new Feedback({});
  vialsFeedback : Feedback = new Feedback({});

  vialsGridApi: GridApi;
  onVialsGridReady(params) {
    console.log('vials ready');
    this.vialsGridApi = params.api;
  }

  inventoryGridApi: GridApi;
  onInventoryGridReady(params) {
    console.log('inventory ready');
    this.inventoryGridApi = params.api;
  }

  onAddRow() {
    let newItem = {};
    let newIndex = this.vialsGridApi.getDisplayedRowCount();
    this.validateNewRows([newItem]);
    this.vialsGridApi.updateRowData({add: [newItem]});
  }

  private validateNewRows(rows) {
    let count = this.vialsGridApi.getDisplayedRowCount();
    let i = 0;
    for(let row of rows) {
      let newIndex = count + i;
      for (let col in this.vialsValidators) {
        for (let validator of this.vialsValidators[col]) {
          let newValue = row[col]? row[col] : '';
          if (!(validator.validate(newValue))) {
            this.vialsFeedback.addFeedback(validator.msgItem, newIndex, col);
          }
        }
      }
      i++;
    }
  }

  // buttons & events:
  onImport(rows: any[]) {
    if(!this.checkHeader(rows)) {
      this.messageHandler.addError('Csv header doesn\'t contain all required fields, please download the template')
      return;
    }
    let importedLocations = this.fixRows(rows);
    this.updateLocations(rows, importedLocations);
    this.validateNewRows(rows);
    this.vialsGridApi.updateRowData({add: rows});
    this.updateInventory()
  }

  private checkHeader(rows: any[]) {
    // for(let colDef in this.vialsColumnDefs) {
    //   if colDef.
    // }
    return true;
  }

  private aggregateRowsByLocation(locationsRows, rows) {
    for(let row of rows) {
      let location = row['Location'];
      if(location) {
        if(locationsRows[location] === undefined) {
          locationsRows[location] = [];
        }
        locationsRows[location].push(row);
      }
    }
  }

  private fixRows(rows: any[]) {
    // aggregate rows by location:
    let locationsRows = {};
    this.aggregateRowsByLocation(locationsRows, rows);
    for(let location in locationsRows) {
      let parents = [];
      let types = [];
      for(let row of locationsRows[location]) {
        // console.log(row['Parent']);
        if(row['Parent'] !== undefined) {
          parents.push(row['Parent']);
        }
        if(row['Type'] !== undefined) {
          types.push(row['Type']);
        }
      }
      let uniqueParents = Array.from(new Set(parents));
      // if parent collision - choose first one:
      if(uniqueParents.length > 0) {
        for(let row of locationsRows[location]) {
          row['Parent'] = uniqueParents[0];
        }
        if(uniqueParents.length > 1) {
          this.messageHandler.addWarning('\'Parent\' field collision on imported location: ' + location + ', found these values: [' + uniqueParents + '], chose the first one (' + uniqueParents[0] + ')');
        }
      }
      let uniqueTypes = Array.from(new Set(types));
      // if type collision - choose first one:
      if(uniqueTypes.length > 0) {
        for(let row of locationsRows[location]) {
          row['Type'] = uniqueTypes[0];
        }
        if(uniqueTypes.length > 1) {
          this.messageHandler.addWarning('\'Type\' field collision on imported location: ' + location + ', found these values: [' + uniqueTypes + '], chose the first one (' + uniqueTypes[0] + ')');
        }
      }
    }
    let importedLocations = {};
    for(let location of Object.keys(locationsRows)) {
      if(locationsRows[location][0]['Type'] !== undefined || locationsRows[location][0]['Parent'] !== undefined){
        importedLocations[location] = {Type: locationsRows[location][0]['Type'], Parent: locationsRows[location][0]['Parent']};
      }
    }
    return importedLocations;
  }

  private updateLocations(rows: any[], importedLocations) {
    console.log('importedLocations:');
    console.log(importedLocations);
    for(let location of Object.keys(importedLocations)) {
      if(this.locationsData[location] !== undefined) {
        if(this.locationsData[location]['New'] == 'Yes') {
          this.locationsData[location]['Type'] = importedLocations[location]['Type'];
          this.locationsData[location]['Parent'] = importedLocations[location]['Parent'];
        } else {
          if(this.locationsData[location]['Type'] !== importedLocations[location]['Type'] || this.locationsData[location]['Parent'] !== importedLocations[location]['Parent']) {
            this.messageHandler.addWarning('Location: ' + location + ' conflict, imported location(type: ' +
              importedLocations[location]['Type'] + ', parent: ' + importedLocations[location]['Parent'] + ') description differ the one from the DB(type: ' +
              this.locationsData[location]['Type'] + ', parent: ' + this.locationsData[location]['Parent'] + ') - discarded this location changes!');
          }
        }
      }
    }
  }

  onRemoveSelected() {
    let rowIndices = [];
    for(let rowNode of this.vialsGridApi.getSelectedNodes()) {
      rowIndices.push(rowNode.rowIndex);
    }
    this.vialsFeedback.removeRows(rowIndices);
    this.vialsGridApi.updateRowData({remove: this.vialsGridApi.getSelectedRows()});
    this.updateInventory();
  }

  onClear() {
    this.locationsData = [];
    this.messageHandler.clear();
    this.vialsGridApi.setRowData([]);
    this.inventoryGridApi.setRowData([]);
    this.vialsFeedback.clearFeedback();
  }

  onExport() {
    let rowData = this.getExtendedRows();
    let filename = 'data.csv';
    let data = this.papa.unparse(rowData);
    this.fileManager.downloadFile(filename, data);
  }

  private getExtendedRows() {
    let rowData = [];
    this.vialsGridApi.forEachNode((node) => {
      let newRow = Object.assign({}, node.data);
      let locationObj = this.locationsData[newRow['Location']];
      newRow['Type'] = locationObj['Type'];//? locationObj['Type']: '';
      newRow['Parent'] = locationObj['Parent'];//? locationObj['Parent']: '';
      rowData.push(newRow);
    });
    return rowData;
  }

  onVialCellValueChanged(params) {
    // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue rowIndex colDef.field);
    // if change detected:
    if(params.oldValue !== params.newValue) {
      this.vialsFeedback.removeFeedback(params.rowIndex, params.colDef.field);
      for (let validator of this.vialsValidators[params.colDef.field]) {
        if (!(validator.validate(params.newValue))) {
          this.vialsFeedback.addFeedback(validator.msgItem, params.rowIndex, params.colDef.field);
        }
      }
      console.log(this.vialsFeedback.feedbackDict);
      if (params.colDef.field === 'Location') {
        this.updateInventory();
      }
      this.vialsGridApi.redrawRows();
    }
  }

  onInventoryCellValueChanged(params) {

  }

  updateInventory() {
    // update inventory grid:
    let locations = [];
    this.vialsGridApi.forEachNode((row) => {
      locations.push(row.data['Location']);
    });
    locations = Array.from(new Set(locations));
    let params = new HttpParams();
    for (let location of locations) {
      params = params.append('locations', location)
    }
    this.httpClient.get('cm/location_query/', {params: params}).subscribe(
      (data) => {
        console.log('success');
        console.log(data);
        this.setLocations(data);
      },
      (error) => {
        console.log('error');
        console.log(error);
        this.messageHandler.addError('failed checking locations - ' + error.message);
      }
    );
  }

  private setLocations(newLocationsData) {
    let inventoryData = [];
    let i = 0;
    for (let location in newLocationsData) {
      // ignore blank locations:
      if (!location) continue;
      // don't overwrite old locations:
      if (this.locationsData[location] !== undefined) {
        newLocationsData[location] = this.locationsData[location];
      }
      else {
        if (newLocationsData[location] !== null) {
          newLocationsData[location]['New'] = 'No';
          newLocationsData[location]['Type'] = newLocationsData[location]['Location Type'];
        }
        else {
          newLocationsData[location] = {};
          newLocationsData[location]['New'] = 'Yes';
          newLocationsData[location]['Type'] = 'BOX';
        }
        newLocationsData[location]['Location'] = location;
      }
      inventoryData.push(newLocationsData[location]);
      i++;
    }
    console.log(inventoryData);
    this.locationsData = newLocationsData;
    this.inventoryGridApi.setRowData(inventoryData);
  }

  onSubmit() {
    let rowData = this.getExtendedRows();
    console.log(rowData);
    this.httpClient.post('/api/vials/register-dry', rowData).subscribe(
      (data) => {
        console.log('success');
        console.log(data);
        // let the user know if submission faild:
        if(data['errors'].length > 0 || new Feedback(data['table_feedback']).errorsExist() ) {
          this.messageHandler.addError('failed submitting vials - errors exist!');
        }
        // register returned feedback messages:
        this.registerFeedback(data['table_feedback']);
        this.messageHandler.addInfos(data['infos']);
        this.messageHandler.addWarnings(data['warnings']);
        this.messageHandler.addErrors(data['errors']);
      },
      (error) =>  {
        console.log('error');
        console.log(error);
        this.messageHandler.addError('failed submitting vials - ' + error.message);
      }
    );
  }

  // TODO: see if we need the split the feedback to both grids.
  private registerFeedback(expendedFeedback) {
    this.vialsFeedback.mergeFeedback(expendedFeedback);
    this.vialsGridApi.redrawRows();
  }
}
