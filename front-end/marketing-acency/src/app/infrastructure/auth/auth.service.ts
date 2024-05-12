import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError, map } from 'rxjs';
import { User } from './model/user.model';
import { UserService } from 'src/app/feature-modules/user/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './service/api.service';
import { Client } from 'src/app/feature-modules/user/model/client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<User>({id: 0, mail: "", password: "", confirmationPassword: "", roles: [{ id: 0, name: '', permissions: [] }], isBlocked: false, isActivated:false});
  private access_token: string | null = null; 
  private refresh_token: string | null = null; 
  isFirstLogin: boolean = false;
  clearTimeout: any;

  constructor(private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private userService: UserService) { 
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        this.access_token = storedToken;
        this.setUser();
      }
    }


  findByMail(mail: string): Observable<any> {
    return this.http.get(`https://localhost:8443/auth/findByEmail/${mail}`);
  }  


  saveUser(user: User): Observable<any> { 
    return this.http.post<User>(`https://localhost:8443/client/save-user`, user);
  }

  registerClient(client: Client): Observable<any> {
    return this.http.post<Client>(`https://localhost:8443/client/register`, client);
  }
  

  
  login(user: User) {

    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    // const body = `username=${user.username}&password=${user.password}`;
    const body = {
      'mail': user.mail,
      'password': user.password
    };

  
    
    
    return this.apiService.post(`https://localhost:8443/auth/login`, JSON.stringify(body), loginHeaders)
      .pipe(map((res) => {
        console.log('Login success',res);
        this.access_token = res.body.accessToken;
        this.refresh_token = res.body.refreshToken;
        localStorage.setItem("access_token", res.body.accessToken)
        localStorage.setItem("refresh_token", res.body.refreshToken)
        this.autoLogout(res.body.accessExpiresIn)
        //this.userService.getMyInfo(user.mail);
        this.setUser();
        return res;
      }));
  }

  checkIfUserExists(): void {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.getToken() || ""; 

    const decodedToken = jwtHelperService.decodeToken(accessToken);
    const user: User = {
      id: decodedToken.id,
      mail: decodedToken.sub,
      password: decodedToken.name || '',   
      confirmationPassword: decodedToken.confirmationPassword || '',
      roles: decodedToken.role || '',
      isBlocked: decodedToken.isBlocked || '',
      isActivated: decodedToken.isActivated || ''
    };
  
    this.user$.next(user);
  }

  autoLogout(expirationDate: number) {
    this.clearTimeout = setTimeout(() => {
      this.logout();
    }, expirationDate)
  }
  

  logout() {
    this.userService.currentUser = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (this.clearTimeout){
      clearTimeout (this.clearTimeout);
    }

    this.access_token = null;
    this.router.navigate(['/login']);
    this.user$.next({id: 0, mail: "", password: "", confirmationPassword: "", roles: [{ id: 0, name: '', permissions: [] }], isBlocked: false, isActivated:false })
  }

  tokenIsPresent() {
    return this.access_token != undefined && this.access_token != null;
  }

  getToken() {
    return this.access_token;
  }

  getCurrentUserId(): number | undefined {
    const accessToken = this.getToken();
    if (!accessToken) return undefined;

    const jwtHelperService = new JwtHelperService();
    const decodedToken = jwtHelperService.decodeToken(accessToken);

    // Extract user ID from decoded JWT token
    const userId = decodedToken && decodedToken.id;

    return userId ? +userId : undefined; // Convert to number or return undefined
  }

  saveUser(user: User): Observable<any> { 
    return this.http.post<User>(`https://localhost:8443/client/save-user`, user);
  }

  registerClient(client: Client): Observable<any> {
    return this.http.post<Client>(`https://localhost:8443/client/register`, client);
  }
}
