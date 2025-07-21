import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface WeatherResponse {
  main: { temp: number; humidity: number; };
  weather: { description: string; icon: string; }[];
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = environment.weatherApiUrl;
  private apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string, units: 'metric'|'imperial' = 'metric'): Observable<WeatherResponse> {
    const url = `${this.apiUrl}/weather?q=${city}&units=${units}&appid=${this.apiKey}`;
    return this.http.get<WeatherResponse>(url);
  }
}
