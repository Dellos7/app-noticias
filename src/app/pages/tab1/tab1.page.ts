import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  noticias: Article[] = [];
  enableInfiniteScroll = true;
  noticiasObsSubscription: Subscription;

  constructor( private noticiasSvc: NoticiasService ) {
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarMasNoticias( event ) {
    this.cargarNoticias( event );
  }

  cargarNoticias( event? ) {
    this.noticiasObsSubscription = this.noticiasSvc.getTopHeadlines().subscribe( resp => {
      this.noticias.push( ...resp.articles );
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
    this.cargarNoticias(event);
  }

}
