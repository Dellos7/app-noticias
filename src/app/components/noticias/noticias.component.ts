import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../interfaces/interfaces';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent implements OnInit {

  @Input() noticias: Article[] = [];
  @Input() enableSkeletonList = true;
  @Input() enFavoritos = false;

  constructor() { }

  ngOnInit() { }

}
