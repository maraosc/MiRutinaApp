import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WgerService {
  private base = environment.wger.baseUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${environment.wger.apiKey}`
  });

  constructor(private http: HttpClient) { }

  /** Ejercicios (público) */
  getExercises(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.base}/exercise/`, { params, headers: this.headers });
  }

  /** Detalle de un ejercicio */
  getExercise(id: number): Observable<any> {
    return this.http.get(`${this.base}/exercise/${id}/`, { headers: this.headers });
  }

  /** Músculos */
  getMuscles(): Observable<any> {
    return this.http.get(`${this.base}/muscle/`, { headers: this.headers });
  }

  /** Categorías */
  getCategories(): Observable<any> {
    return this.http.get(`${this.base}/category/`, { headers: this.headers });
  }

  /** Listado de rutinas (requiere autenticación) */
  getRoutines(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.base}/routine/`, { params, headers: this.headers });
  }
}

