import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'skeleton-text-list',
  templateUrl: './skeleton-text-list.component.html',
  styleUrls: ['./skeleton-text-list.component.scss'],
})
export class SkeletonTextListComponent implements OnInit {

  @Input() numberOfElements: any;
  els: number[] = [];

  constructor() { }

  ngOnInit() {
    if ( !this.numberOfElements ) {
      this.numberOfElements = 5;
    }
    this.els = Array(Number.parseInt(this.numberOfElements, 10));
  }

}
