import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {

  @Input() small: boolean = false;
  @Input() cardType: string = '';
  @Input() cardNumber?: number;
  @Input() cardHolderName: string = '';
  @Input() cardProvider: string = 'mastercard' || 'visa';
  @Input() cardColor: string = '';
  @Input() newCard: boolean = false;



  ngOnInit() {
  }

}
