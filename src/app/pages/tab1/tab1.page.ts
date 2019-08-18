import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  noticias: Article[] = [];
  enableInfiniteScroll = true;
  noticiasObsSubscription: Subscription;
  mostrarFiltradoNoticias = false;
  busquedaValue: string;
  startDateValue: string;
  endDateValue: string;

  constructor( private noticiasSvc: NoticiasService, private alertCtrl: AlertController ) {
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarMasNoticias( event ) {
    this.cargarNoticias( false, event );
  }

  cargarNoticias( resetPages?, event? ) {
    console.log(this.busquedaValue);
    const filtroFechas = this.startDateValue || this.endDateValue ? true : false;
    this.noticiasObsSubscription = this.noticiasSvc.getTopHeadlines( resetPages, this.busquedaValue ).subscribe( resp => {
      this.noticias.push( ...resp.articles );
      console.log('resp articles', resp.articles);
      if ( filtroFechas ) {
        console.log('startdate', new Date(this.startDateValue));
        console.log('enddate', new Date(this.endDateValue));
        // TODO: existe un filtro de fechas en la API (params from y to (ej, 2019-08-19) ). Utilizar
        this.noticias = this.noticias.filter( (article) => {
          return ( this.startDateValue ? new Date(this.startDateValue) <= new Date(article.publishedAt) : true )
            && ( this.endDateValue ? new Date(article.publishedAt) <= new Date(this.endDateValue) : true );
        });
        console.log(this.noticias);
      }
      if ( !resp.articles || resp.articles.length === 0 ) {
        this.enableInfiniteScroll = false;
      }
      if ( event ) {
        event.target.complete();
      }
    });
  }

  doRefresh(event) {
    this.noticiasObsSubscription.unsubscribe();
    this.cargarNoticias(false, event);
  }

  mostrarOcultarFiltros() {
    this.mostrarFiltradoNoticias = !this.mostrarFiltradoNoticias;
    if ( !this.mostrarFiltradoNoticias ) {
      this.busquedaValue = null;
      this.startDateValue = null;
      this.endDateValue = null;
    }
  }

  filtraNoticias(event) {
    this.busquedaValue = event.target.value;
    this.noticias = [];
    this.cargarNoticias(true);
  }

  async cambiaFiltroFechaStart(event) {
    if ( !this.busquedaValue ) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Error al filtrar por fecha',
        message: 'Para poder utilizar el filtro por fechas debes introducir algún término en el campo de búsqueda',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.startDateValue = new Date(event.target.value).toDateString();
      this.noticias = [];
      this.cargarNoticias(true);
    }
  }

  async cambiaFiltroFechaEnd(event) {
    if ( !this.busquedaValue ) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Error al filtrar por fecha',
        message: 'Para poder utilizar el filtro por fechas debes introducir algún término en el campo de búsqueda',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.endDateValue = new Date(event.target.value).toDateString();
      this.noticias = [];
      this.cargarNoticias(true);
    }
  }

}
