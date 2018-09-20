import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie';
import {Injectable} from '@angular/core';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  csrfToken: string;

  constructor(private cookieService:CookieService) {
    let csrf = this.cookieService.get("csrftoken");
    // console.log(csrf);
    // the Angular HttpHeaders class throws an exception if any of the values are undefined
    if (typeof(csrf) === 'undefined') {
      csrf = '';
    }
    this.csrfToken = csrf;
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let colnedReq = req.clone({headers: req.headers.append("X-CSRFToken", this.csrfToken)});
    // console.log('intercepted: ' + this.csrfToken);
    return next.handle(colnedReq);
  }

}
