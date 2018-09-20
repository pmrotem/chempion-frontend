import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {VialsService} from './vials.service';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-vials',
  templateUrl: './vials.component.html',
  styleUrls: ['./vials.component.css']
})
export class VialsComponent implements OnInit, OnDestroy {
  linkElements: {name: string, link: string}[] = [
    {name: 'Register dry vials', link: 'register-dry'},
    {name: 'Register dilution vials', link: 'register-dilute'},
    {name: 'From vial to plate', link: 'place'}
  ]
  selectedLink: string = this.linkElements[0].link;
  linkSelectedSub: Subscription;

  constructor(private vialsService: VialsService) { }

  ngOnInit() {
    this.linkSelectedSub = this.vialsService.linkSelected.subscribe(
      (selectedLink) => {
        this.selectedLink = selectedLink;
      }
    )
  }

  ngOnDestroy(): void {
    this.linkSelectedSub.unsubscribe();
  }

}
