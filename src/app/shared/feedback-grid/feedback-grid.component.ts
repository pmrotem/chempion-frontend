import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-grid',
  templateUrl: './feedback-grid.component.html',
  styleUrls: ['./feedback-grid.component.css']
})
export class FeedbackGridComponent implements OnInit {
  @Input() singleClickEdit = false;
  @Input() height: number = null;
  @Input() width: number = null;
  @Input() rowSelection: string = null;
  @Input() defaultColDef: any = null;
  @Input() rowData = null;
  @Input() columnDefs = null;
  @Input() feedback = null;
  @Output() gridReady: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() cellValueChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  styleText: SafeStyle = null;
  private gridApi: any = null;

  constructor(private sanitizer:DomSanitizer) { }

  getClassGetter(cellClasses) {
    if(cellClasses === undefined || cellClasses === null) {
      cellClasses = '';
    }
    let cellClassesFunc = cellClasses;
    if(typeof cellClasses === 'string') {
      cellClassesFunc = (params) => {
        return cellClasses;
      }
    }
    return (params) => {
      let cellClasses = cellClassesFunc(params);
      // get feedback of row:
      let rowFeedback = this.feedback[params.rowIndex];
      if(rowFeedback === undefined) return cellClasses;
      // check full row items:
      let classes: string[] = [];
      let allItems = rowFeedback.all;
      if(allItems !== undefined) {
        for(let item of allItems) {
          classes.push(item.type);
        }
      }
      // check field items:
      let fieldItems = rowFeedback[params.colDef.field];
      if(fieldItems !== undefined) {
        for(let item of fieldItems) {
          classes.push(item.type);
        }
      }
      // get highest level item type:
      if(classes.indexOf('error') !== -1) return cellClasses + ' error';
      if(classes.indexOf('warning') !== -1) return cellClasses + ' warning';
      if(classes.indexOf('info') !== -1) return cellClasses + ' info';
      return cellClasses;
    };
  }

  // myCellRenderer = (params) => {
  //   // get msgs:
  //   let rowFeedback = this.vialsFeedback[params.rowIndex];
  //   if(rowFeedback === undefined) return null;
  //   // check full row items:
  //   let msgs = [];
  //   let allItems = rowFeedback.all;
  //   if(allItems !== undefined) {
  //     for(let item of allItems) {
  //       msgs.push(item.msg);
  //     }
  //   }
  //   // check field items:
  //   let fieldItems = rowFeedback[params.colDef.field];
  //   if(fieldItems !== undefined) {
  //     for(let item of fieldItems) {
  //       msgs.push(item.msg);
  //     }
  //   }
  //   // create DOM element
  //   let cellDiv = this.renderer.createElement('div');
  //   let spanChild = this.renderer.createElement('span');
  //   let value = params.value;
  //   if(params.value === undefined){
  //     value = '';
  //   }
  //   const text = this.renderer.createText(value);
  //   this.renderer.appendChild(cellDiv, text);
  //   this.renderer.appendChild(cellDiv, spanChild);
  //   this.renderer.setStyle(cellDiv, 'height', '100%');
  //   this.renderer.setStyle(cellDiv, 'width', '100%');
  //   this.renderer.addClass(cellDiv, 'my-tooltip');
  //   this.renderer.addClass(spanChild, 'my-tooltiptext');
  //   if(msgs.length > 0) {
  //     let tooltipText = this.renderer.createText(msgs.toString());
  //     this.renderer.appendChild(spanChild, tooltipText);
  //     // this.renderer.setAttribute(cellDiv, 'data-tooltip-position', 'top');
  //   }
  //   return cellDiv;
  // };

  tooltipGetter = (params) => {
    // get msgs:
    let rowFeedback = this.feedback[params.rowIndex];
    if(rowFeedback === undefined) return null;
    // check full row items:
    let msgs = [];
    let allItems = rowFeedback.all;
    if(allItems !== undefined) {
      for(let item of allItems) {
        msgs.push(item.msg);
      }
    }
    // check field items:
    let fieldItems = rowFeedback[params.colDef.field];
    if(fieldItems !== undefined) {
      for(let item of fieldItems) {
        msgs.push(item.msg);
      }
    }
    return msgs.toString();
  };

  ngOnInit() {
    // set style:
    let styleValue = (this.height)? 'height: ' + this.height + 'px;' : '';
    styleValue += (this.width)? 'width: ' + this.width + 'px;' : '';
    this.styleText = this.sanitizer.bypassSecurityTrustStyle(styleValue);
    // add tooltip setter and class setter to column defs:
    for(let col of this.columnDefs) {
      col.cellClass = this.getClassGetter(col.cellClass);
      col.tooltip = this.tooltipGetter;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridReady.emit(params);
  }

  onCellValueChanged(event) {
    this.cellValueChanged.emit(event);
  }
}
