import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiUrl = environment.apiUrl;
    const authEndpoint = '/auth/';

    if (request.url.startsWith(apiUrl) && !request.url.includes(authEndpoint)) {
      const currentUserToken: any =
        this.authenticationService.currentUserTokenValue;

      if (currentUserToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUserToken}`,
          },
        });
      }
    }

    return next.handle(request);
  }
}
