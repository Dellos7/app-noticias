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

  getTopHeadlines( resetPages?: boolean, filtro?: string, ordenarPor?: string, fechaStart?: string, fechaEnd?: string ) {
    if ( resetPages ) {
      this.headlinesPage = 0;
    }
    this.headlinesPage++;
    if ( filtro ) {
      return this.obtenerNoticiasFiltroTextoYFechas( filtro, ordenarPor, fechaStart, fechaEnd );
    }
    return this.ejecutarQuery<NewsApiResponse>(`/top-headlines?country=us&page=${this.headlinesPage}`);
  }

  obtenerNoticiasFiltroTextoYFechas( filtro: string, ordenarPor?: string, fechaStart?: string, fechaEnd?: string ) {
    return this.ejecutarQuery<NewsApiResponse>(
      `/everything?q=${filtro}&sortBy=${ordenarPor}&page=${this.headlinesPage}` +
      `${fechaStart ? '&from=' + fechaStart : ''}` +
      `${fechaEnd ? '&to=' + fechaEnd : ''}`
      );
  }

  getTopHeadlinesPorCategoria( categoria: string ) {
    if ( categoria !== this.categoriaActual ) {
      this.categoriaActual = categoria;
      this.categoriaPage = 0;
    }
    this.categoriaPage++;
    return this.ejecutarQuery<NewsApiResponse>(`/top-headlines?country=us&category=${categoria}&page=${this.categoriaPage}`);
  }

  formatDate( date: Date ): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

}
