import { Injectable } from '@angular/core';
import {Cookie} from 'ng2-cookies';

//imported

import {Observable} from 'rxjs';
import 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url='https://chatapi.edwisor.com';

  constructor(public http:HttpClient) { }

  public getUserInfoFromLocalStorage=()=>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage =(data)=>{
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public signupFunction(data):Observable<any>{

      const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('apiKey', data.apiKey);

      return this.http.post(`${this.url}/api/v1/users/signup`, params);

  }// end of signup function

  public signinFunction(data):Observable<any>{

    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);

}// end of signin function

private handleError(err: HttpErrorResponse){

  let errorMessage = '';

  if (err.error instanceof Error) {

    errorMessage = `An error occurred: ${err.error.message}`;

  } else {

    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

  } // end condition *if

  console.error(errorMessage);

  return Observable.throw(errorMessage);
}

public logout(): Observable<any> {

  const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))

  return this.http.post(`${this.url}/api/v1/users/logout`, params);

} // end logout function

}
