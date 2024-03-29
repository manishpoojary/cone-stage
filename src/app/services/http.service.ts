﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../admin/models';
import { Consultant } from '../admin/models';
import { CategoryTypes } from '@app/admin/models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(value) {
    console.log(value);

    return this.http.post<User>(`${environment.apiUrl}/auth_user`, value).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
        console.log(user);
      })
    );
  }

  loginConsultant(value) {
    console.log(value);

    return this.http
      .post<User>(`${environment.apiUrl}/authenticate_consultant`, value)
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
          console.log(user);
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/consultant`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map((x) => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }

  deleteConsultants(id: string) {
    return this.http.delete(`${environment.apiUrl}/consultant/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }

  getAnalytics() {
    return this.http.get<User>(`${environment.apiUrl}/basic_analytics`);
  }

  getAllCategoryTypes() {
    return this.http.get<CategoryTypes[]>(
      `${environment.apiUrl}/category_types`
    );
  }

  categoryTypeCreate(CategoryTypes: CategoryTypes) {
    return this.http.post(
      `${environment.apiUrl}/category_types`,
      CategoryTypes
    );
  }

  categoryTypeUpdate(id, params) {
    return this.http
      .put(`${environment.apiUrl}/category_types/${id}`, params)
      .pipe(
        map((x) => {
          // update stored user if the logged in user updated their own record
          if (id == this.userValue.id) {
            // update local storage
            const user = { ...this.userValue, ...params };
            localStorage.setItem('user', JSON.stringify(user));

            // publish updated user to subscribers
            this.userSubject.next(user);
          }
          return x;
        })
      );
  }

  deleteCategoryType(id) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id,
    };

    return this.http.delete(`${environment.apiUrl}/category_types`, options);
  }

  getCategoryById(id: string) {
    return this.http.get(`${environment.apiUrl}/category_types/${id}`);
  }

  getAllCategoryEditor() {
    return this.http.get<CategoryTypes[]>(
      `${environment.apiUrl}/category_editor`
    );
  }

  categoryEditorCreate(CategoryTypes: CategoryTypes) {
    return this.http.post(
      `${environment.apiUrl}/category_editor`,
      CategoryTypes
    );
  }

  categoryEditorUpdate(id, params) {
    return this.http
      .put(`${environment.apiUrl}/category_editor/${id}`, params)
      .pipe(
        map((x) => {
          // update stored user if the logged in user updated their own record
          if (id == this.userValue.id) {
            // update local storage
            const user = { ...this.userValue, ...params };
            localStorage.setItem('user', JSON.stringify(user));

            // publish updated user to subscribers
            this.userSubject.next(user);
          }
          return x;
        })
      );
  }

  deleteCategoryEditorType(id) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id,
    };

    return this.http.delete(`${environment.apiUrl}/category_editor`, options);
  }

  getCategoryEditorById(id: string) {
    return this.http.get(`${environment.apiUrl}/category_editor/${id}`);
  }

  getConsultantCategory() {
    return this.http.get(
      `${environment.apiUrl}/category_types/get_category_types`
    );
  }

  registerConsultant(consultant: Consultant) {
    return this.http.post(`${environment.apiUrl}/consultant`, consultant);
  }

  putConsultantCategory(id, params) {
    return this.http.put(
      `${environment.apiUrl}/consultant/consultant_categories?id=${id}`,
      params
    );
  }

  getSubCategoryBasedOnCategory(id) {
    return this.http.get(
      `${environment.apiUrl}/category_editor/get_categories_on_type?category_type_id=${id}`
    );
  }
}
