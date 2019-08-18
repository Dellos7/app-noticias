import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';

// Comprobar si es una app o no (se ejecuta desde la web)
const IS_APP = document.URL.indexOf('http') !== 0;
const _navigator: any = navigator;

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() index: number;
  @Input() enFavoritos: boolean;

  webSocialShareOptions: any;

  constructor( private iab: InAppBrowser,
               private actionSheetCtrl: ActionSheetController,
               private socialSharing: SocialSharing,
               private dataLocalSvc: DataLocalService,
               private toastCtrl: ToastController) { }

  ngOnInit() {
    this.webSocialShareOptions = {
      displayNames: true,
      config: [{
        facebook: {
          socialShareUrl: this.noticia.url
        }
      }, {
        twitter: {
          socialShareUrl: this.noticia.url
        },
      },
      {
        reddit: {
          socialShareUrl: this.noticia.url
        }
      },
      {
        linkedin: {
          socialShareUrl: this.noticia.url
        }
      },
      {
        pinterest: {
          socialShareUrl: this.noticia.url
        }
      },
      {
        email: {
          socialShareBody: `${this.noticia.title} - ${this.noticia.url}`
        }
      },
      {
        whatsapp: {
          socialShareText: `${this.noticia.title} - ${this.noticia.source.name}`,
          socialShareUrl: this.noticia.url
        }
      },
      {
        copy: {
          socialShareUrl: this.noticia.url
        }
      }]
    };
  }

  abrirNoticia() {
    this.iab.create(this.noticia.url, '_system');
  }

  async abrirActionSheet() {

    let guardarBorrarBtn: any;
    if ( this.enFavoritos ) {
      guardarBorrarBtn = {
        text: 'Eliminar favorito',
        icon: 'trash',
        handler: async () => {
          this.eliminarNoticiaFavorito();
          const toast = await this.toastCtrl.create({
            message: 'Noticia eliminada de favoritos',
            duration: 2000
          });
          toast.present();
        }
      };
    } else {
      guardarBorrarBtn = {
        text: 'Favorito',
        icon: 'heart',
        handler: async () => {
          const existe = this.guardarNoticiaFavorito();
          const toast = await this.toastCtrl.create({
            message: !existe ? 'Noticia añadida a favoritos' : 'Esta noticia ya existe en favoritos',
            duration: 2000
          });
          toast.present();
        }
      };
    }

    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'action-dark',
      translucent: false,
      buttons: [
      {
        text: 'Compartir',
        icon: 'share',
        handler: () => {
          this.socialShare();
        }
      },
      guardarBorrarBtn,
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
    });
    await actionSheet.present();
  }

  async socialShare() {
    if ( IS_APP ) {
      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      );
    } else if ( _navigator && _navigator.share ) {
      const ssr = await _navigator.share({
        title: this.noticia.title,
        text: this.noticia.source.name,
        url: this.noticia.url
      });
      console.log('ssr', ssr);
    } else {
      const webSocialShareEl: any = document.getElementById(`wss-${this.index + 1}`);
      if ( webSocialShareEl ) {
        webSocialShareEl.show = true;
      }
    }
  }

  onWebSocialShareClose() {
    console.log('onWebSocialShareClose');
  }

  guardarNoticiaFavorito(): boolean {
    return this.dataLocalSvc.guardarNoticiaFavorito( this.noticia );
  }

  eliminarNoticiaFavorito() {
    this.dataLocalSvc.eliminarNoticiaFavorito( this.noticia );
  }

}
