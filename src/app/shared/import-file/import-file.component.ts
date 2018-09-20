import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FilePickerDirective, ReadFile, ReadMode} from 'ngx-file-helpers';
import {PapaParseService} from 'ngx-papaparse';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.css']
})
export class ImportFileComponent implements OnInit {
  @Output() import: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private papa: PapaParseService) { }

  ngOnInit() {
  }

  // file reading and csv parsing:
  file : File = null;
  readMode = ReadMode.text;
  picked: ReadFile = null;
  @ViewChild(FilePickerDirective)
  private filePicker;

  onReadStart(fileCount: number) {
    console.log(`Reading ${fileCount} file(s)...`);
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
    this.papa.parse(file.content, {
      complete: (results, file) => {
        for (let error of results.errors) {
          results.data.splice(error.row);
        }
        this.import.emit(results.data);
      }, header: true
    });
  }

  onReadEnd(fileCount: number) {
    console.log(`Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`);
    this.filePicker.reset();
  }
}
