import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ILoginResponse, IUser } from '../models/auth.model';
import { LOGIN_API, LOGOUT_API } from '../constants/api.constants';
import { jwtDecode } from 'jwt-decode';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private navigationService: NavigationService
  ) {}

  login(username: string, password: string) {
    this.http
      .post<ILoginResponse>(LOGIN_API, { username, password })
      .pipe(
        map((response) => {
          this.enableLoggedinSession(response.token);
          return response;
        })
      )
      .subscribe((response) => {
        this.navigationService.goToHome();
      });
  }

  logout() {
    this.http.post(LOGOUT_API, {}).subscribe(() => {
      this.disableLoggedinSession();
    });
  }

  private enableLoggedinSession(token: string) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', token);
    const decodedToken: IUser = jwtDecode(token);
    localStorage.setItem('isAdmin', String(decodedToken.role === 'admin'));
  }

  private disableLoggedinSession() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    this.navigationService.goToLogin();
  }
}
