import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { SkeletonTextListComponent } from "./skeleton-text-list/skeleton-text-list.component";
import { CommonModule } from "@angular/common";
import { NoticiasComponent } from "./noticias/noticias.component";
import { NoticiaComponent } from "./noticia/noticia.component";
import { NetworkComponent } from './network/network.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [
    SkeletonTextListComponent,
    NoticiasComponent,
    NoticiaComponent,
    NetworkComponent
  ],
  exports: [SkeletonTextListComponent, NoticiasComponent, NoticiaComponent, NetworkComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CustomComponentsModule {}
