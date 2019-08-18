import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  noticiasFavoritas: Article[] = [];

  constructor( private storage: Storage ) {
    this.cargarNoticiasFavoritas();
  }

  guardarNoticiaFavorito( noticia: Article ): boolean {
    const existe = this.noticiasFavoritas.find( noti => noti.title === noticia.title );
    if ( !existe ) {
      this.noticiasFavoritas.unshift( noticia );
      this.storage.set( 'favoritos', this.noticiasFavoritas );
      return false;
    }
    return true;
  }

  eliminarNoticiaFavorito( noticia: Article ) {
    const i = this.noticiasFavoritas.findIndex( noti => noti.title === noticia.title );
    if ( i >= 0 ) {
      this.noticiasFavoritas.splice( i, 1 );
    }
    this.storage.set( 'favoritos', this.noticiasFavoritas );
  }

  async cargarNoticiasFavoritas() {
    const noticiasFavoritas = await this.storage.get( 'favoritos' ) as Article[];
    if ( noticiasFavoritas ) {
      this.noticiasFavoritas = noticiasFavoritas;
    }
  }

}
