import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

// Comprobar si es una app o no (se ejecuta desde la web)
const IS_APP = document.URL.indexOf('http') !== 0;
// tslint:disable-next-line: variable-name
const _navigator: any = navigator;

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  toast: HTMLIonToastElement;
  firstTime = true;

  constructor(
    private network: Network,
    private toastController: ToastController,
    private sb: StatusBar
  ) {}

  ngOnInit() {
    console.log('ngOnInit network.component');
    this.networkEvents();
  }

  networkEvents() {
    if ( IS_APP ) {
      this.appNetworkEvents();
    } else {
      this.browserNetworkEvents();
    }
  }

  appNetworkEvents() {
    this.onNetworkConnect();
    this.onNetworkDisconnect();
  }

  browserNetworkEvents() {
    this.browserNetwork$().subscribe( redConectada => {
      if ( redConectada ) {
        this.mostrarMensajeRedConectada();
      } else {
        this.mostrarMensajeRedDesconectada();
      }
    });
  }

  onNetworkConnect() {
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.mostrarMensajeRedConectada();
      this.sb.overlaysWebView(false);
      this.sb.styleLightContent();
      this.sb.backgroundColorByName('darkGray');
    });
  }

  onNetworkDisconnect() {
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.mostrarMensajeRedDesconectada();
      this.sb.overlaysWebView(false);
      this.sb.backgroundColorByName('red');
    });
  }

  async mostrarMensajeRedDesconectada() {
    if (this.toast) {
      this.toast.dismiss();
    }
    this.toast = await this.toastController.create({
      header: 'Red desconectada',
      message: 'Se ha perdido la conexión con la red.',
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('Click cerrar');
          }
        }
      ]
    });
    this.toast.present();
  }

  async mostrarMensajeRedConectada() {
    if (this.toast) {
      this.toast.dismiss();
    }
    // Se lanza la primera vez que se abre la app
    if (this.firstTime) {
      this.firstTime = false;
      return;
    }
    this.toast = await this.toastController.create({
      header: 'Red conectada',
      message: 'Se ha vuelto a conectar con la red.',
      position: 'bottom',
      color: 'success',
      duration: 2000,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('Click cerrar');
          }
        }
      ]
    });
    this.toast.present();
  }

  browserNetwork$() {
    return merge(
      fromEvent(window, 'offline').pipe(mapTo(false)),
      fromEvent(window, 'online').pipe(mapTo(true)),
      of(_navigator.onLine),
      new Observable( (sub) => {
        sub.complete();
      })
    );
  }
}
