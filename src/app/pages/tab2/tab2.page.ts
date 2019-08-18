import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NoticiasService } from '../../services/noticias.service';
import { Article } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  noticias: Article[] = [];
  @ViewChild(IonSegment, { static: false }) segment: IonSegment;
  categorias = [ 'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology' ];
  segmentValue = this.categorias[0];
  enableInfiniteScroll = true;
  noticiasObsSubscription: Subscription;

  ngOnInit(): void {}

  constructor( private noticiasSvc: NoticiasService ) {
  }

  ionViewDidEnter() {
    this.segment.value = this.segmentValue;
  }

  segmentChanged(event) {
    this.segment.value = event.detail.value;
    this.segmentValue = this.segment.value;
    this.noticias = [];
    this.cargarNoticias( this.segmentValue );
  }

  cargarNoticias( categoria: string, event? ) {
    this.noticiasObsSubscription = this.noticiasSvc.getTopHeadlinesPorCategoria( categoria ).subscribe( resp => {
      this.noticias.push( ...resp.articles );
      if ( !resp.articles || resp.articles.length === 0 ) {
        this.enableInfiniteScroll = false;
      }
      if ( event ) {
        event.target.complete();
      }
    });
  }

  cargarMasNoticias(event) {
    // this.cargarNoticias( this.segmentValue, event );
  }

  doRefresh(event) {
    this.noticiasObsSubscription.unsubscribe();
    this.cargarNoticias(this.segmentValue, event);
  }

}
