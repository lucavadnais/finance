import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CardComponent} from "../card/card.component";
import {FormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {NgStyle} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonComponent} from "../button/button.component";
import {AccountProvider} from "../../providers/account.provider";
import {User} from "../../models/user.model";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {Account, AccountToApi} from "../../models/transaction.model";
import {RefreshService} from "../../services/refresh.service";
import {BottomSheetService} from "../../services/bottom-sheet.service";

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CardComponent,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    NgStyle,
    InputNumberModule,
    ButtonComponent
  ],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent {
  @ViewChild('colorPickerPrimary') colorPickerPrimary: any;
  @ViewChild('colorPickerSecondary') colorPickerSecondary: any;


  primaryColor = '';
  secondaryColor = '';
  user: User;
  initialAmount= 0;

  newAccountCard: AccountToApi = {
    user_id: '',
    type: 'debit',
    currency: "cad",
    provider: 'visa',
    name: '',
    lastDigits: undefined,
    color: 'linear-gradient(#de7171, rgba(220, 9, 9, 0.8))',
    createdAt: new Date()
  }


  constructor(
    private bottomSheetService: BottomSheetService,
    private refreshService: RefreshService,
    private accountProvider: AccountProvider,
    private authProvider: AuthProvider
  ) {
    this.user = JSON.parse(this.authProvider.getToken());
    this.newAccountCard.user_id = this.user._id;
    this.newAccountCard.name = this.user.first_name + ' ' + this.user.last_name;
  }


  triggerPrimaryColorPicker() {
    this.colorPickerPrimary.nativeElement.click();
  }

  triggerSecondaryColorPicker() {
    this.colorPickerSecondary.nativeElement.click();
  }

  onColorChange(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    const selectedColor = input.value;
    if (type === 'primary') {
      this.primaryColor = selectedColor;
      this.newAccountCard.color = `linear-gradient(${selectedColor}, ${this.secondaryColor ? this.secondaryColor : 'transparent'})`;
    } else if (type === 'secondary') {
      this.secondaryColor = selectedColor;
      this.newAccountCard.color = `linear-gradient(${this.primaryColor}, ${selectedColor})`;
    }
  }

  addNewAccount() {
    this.accountProvider.createNewAccount(this.newAccountCard).then(() => {
      this.refreshService.emitRefreshNewAccountEvent();
      this.bottomSheetService.emitOpenBottomSheetEvent();
    }).catch(err => {
      console.error(err);
    });
  }
}
