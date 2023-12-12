// home.page.ts

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

interface WeatherData {
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  weather: { description: string; icon: string }[];
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  savedCities: string[] = [];
  showHistory = false;
  cityName = '';
  weatherTemp: WeatherData | undefined;
  todayDate = new Date();
  weatherIcon: string | undefined;
  loading = true;

  constructor(public httpClient: HttpClient, private navCtrl: NavController) {}

  loadData() {
    this.loading = true;
    this.httpClient.get<WeatherData>(`${API_URL}/weather?q=${this.cityName}&appid=${API_KEY}`).subscribe(
      (results) => {
        this.weatherTemp = {
          main: results.main,
          name: results.name,
          weather: results.weather,
          sys: results.sys,
        };
        this.weatherIcon = `https://openweathermap.org/img/wn/${this.weatherTemp.weather[0]?.icon}@2x.png`;
        this.loading = false;

        // Přidat hledané město do historie
        if (this.cityName && !this.savedCities.includes(this.cityName)) {
          this.savedCities.push(this.cityName);
        }
      },
      (error) => {
        if (error.status === 404) {
          console.error('Město nenalezeno! Prosím, vlož existující město.', this.cityName);
          this.weatherTemp = undefined;
        } else {
          console.error('Error fetching weather data:', error);
        }
        this.loading = false;
      }
    );
  }

  navigateToInfoPage() {
    this.navCtrl.navigateForward('/info-page');
  }

  selectCity(city: string) {
    this.cityName = city;
    this.loadData();
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }
}
