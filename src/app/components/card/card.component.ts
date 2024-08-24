import {Component, Input} from '@angular/core';
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
export class CardComponent {

  @Input() cardType: string = '';
  @Input() cardNumber: string = '';
  @Input() cardHolderName: string = '';
  @Input() cardProvider: string = 'masterCard' || 'visa';
  @Input() cardColor: string = '';

}
