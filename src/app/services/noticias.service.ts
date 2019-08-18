import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewsApiResponse } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const apiKey = environment.newsApiKey;
const apiUrl = environment.newsApiUrl;

const headers = new HttpHeaders({
  'X-Api-key': apiKey
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPage = 0;

  categoriaActual = '';
  categoriaPage = 0;

  constructor( private http: HttpClient ) { }

  private ejecutarQuery<T>( query: string ) {
    query = `${apiUrl}${query}`;
    return this.http.get<T>(query, { headers });
  }

  getTopHeadlines() {
    this.headlinesPage++;
    return this.ejecutarQuery<NewsApiResponse>(`/top-headlines?country=us&page=${this.headlinesPage}`);
  }

  getTopHeadlinesPorCategoria( categoria: string ) {
    if ( categoria !== this.categoriaActual ) {
      this.categoriaActual = categoria;
      this.categoriaPage = 0;
    }
    this.categoriaPage++;
    return this.ejecutarQuery<NewsApiResponse>(`/top-headlines?country=us&category=${categoria}&page=${this.categoriaPage}`);
  }
}
