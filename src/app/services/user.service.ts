import { Injectable } from '@angular/core';
import {ErrorHelper} from '../helpers/error.helper';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

  private endpoint = environment.evoppiUrl + 'api/user';

  constructor(private http: HttpClient) { }

  getRole(login: string, password: string): Observable<string> {
    return this.http.get<string>(this.endpoint + '/role', {params: {login: login, password: password}})
      .pipe(
        catchError(ErrorHelper.handleError('getRole', null))
      );
  }
}
