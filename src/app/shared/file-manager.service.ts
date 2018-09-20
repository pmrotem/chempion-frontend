
export class FileManagerService {
  constructor() {}

  downloadFile(filename, data) {
    console.log('dass');
    let blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    let blobObject = URL.createObjectURL(blob);
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
      window.navigator.msSaveBlob(blob, filename);
    else
    {
      let link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      link['href'] = blobObject;
      link['download'] = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
