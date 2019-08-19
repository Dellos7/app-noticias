import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          '-webkit-transform': 'translate3d(0, -100%, 0)',
          transform: 'translate3d(0, -100%, 0)',
          visibility: 'visible'
        }),
        animate('500ms ease-in-out',
          style({
            '-webkit-transform': 'translate3d(0, 0, 0)',
            transform: 'translate3d(0, 0, 0)'
          })
        )
      ]),
      transition(':leave', [
        animate('500ms ease-in-out',
          style({
            visibility: 'hidden',
            '-webkit-transform': 'translateY(-100%)',
            transform: 'translateY(-100%)'
          }))
      ])
    ])
  ]
})
export class Tab1Page implements OnInit {

  noticias: Article[] = [];
  enableInfiniteScroll = true;
  noticiasObsSubscription: Subscription;
  mostrarFiltradoNoticias = false;
  busquedaValue: string;
  startDateValue: string;
  endDateValue: string;
  startDateValueFiltro: string;
  endDateValueFiltro: string;
  searchBarIcon = 'search';
  ordenarPor = 'publishedAt';

  constructor( private noticiasSvc: NoticiasService, private alertCtrl: AlertController ) {
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarMasNoticias( event ) {
    this.cargarNoticias( false, event );
  }

  cargarNoticias( resetPages?, event? ) {
    if ( resetPages ) { this.noticias = []; }
    this.noticiasObsSubscription =
      this.noticiasSvc.getTopHeadlines(
        resetPages, this.busquedaValue, this.ordenarPor, this.startDateValueFiltro, this.endDateValueFiltro
        ).subscribe( resp => {
          this.noticias.push( ...resp.articles );
          if ( !resp.articles || resp.articles.length === 0 ) {
              this.enableInfiniteScroll = false;
            }
          if ( event ) {
              event.target.complete();
            }
      }, async error => {
        if ( event ) {
          event.target.complete();
        }
        const alert = await this.alertCtrl.create({
          header: 'Error',
          subHeader: 'Error al cargar las noticias',
          message: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
  }

  doRefresh(event) {
    this.noticiasObsSubscription.unsubscribe();
    this.cargarNoticias(true, event);
  }

  mostrarOcultarFiltros() {
    this.mostrarFiltradoNoticias = !this.mostrarFiltradoNoticias;
    this.searchBarIcon = this.mostrarFiltradoNoticias ? 'close' : 'search';
    if ( !this.mostrarFiltradoNoticias ) {
      this.busquedaValue = null;
      this.startDateValue = null;
      this.endDateValue = null;
      this.startDateValueFiltro = null;
      this.endDateValueFiltro = null;
    }
  }

  filtraNoticias(event) {
    this.busquedaValue = event.target.value;
    this.cargarNoticias(true);
  }

  async cambiaFiltroFechaStart(event) {
    this.startDateValueFiltro = this.noticiasSvc.formatDate( new Date(event.target.value) );
    if ( !this.busquedaValue ) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Error al filtrar por fecha',
        message: 'Para poder utilizar el filtro por fechas debes introducir algún término en el campo de búsqueda',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.cargarNoticias(true);
    }
  }

  async cambiaFiltroFechaEnd(event) {
    // Quitamos 1 día al filtro porque la API no va bien y saca también los del día siguiente
    const date = new Date(event.target.value);
    date.setDate( date.getDate() - 1 );
    this.endDateValueFiltro = this.noticiasSvc.formatDate( date );
    if ( !this.busquedaValue ) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Error al filtrar por fecha',
        message: 'Para poder utilizar el filtro por fechas debes introducir algún término en el campo de búsqueda',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.cargarNoticias(true);
    }
  }

  async ordenarPorChange(event) {
    if ( !this.busquedaValue ) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Error al utilizar la ordenación',
        message: 'Para poder ordenar las noticias debes introducir algún término en el campo de búsqueda',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.cargarNoticias(true);
    }
  }

}
