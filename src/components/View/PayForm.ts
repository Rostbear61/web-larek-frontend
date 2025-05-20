import { Component } from '../base/Component';
import { IPayForm, IEvents, TPaymentMethod} from '../../types';

export class PayForm extends Component<IPayForm> {
  private formElement: HTMLFormElement;
  private onlineButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorSpan: HTMLElement;
  private _container: HTMLElement;
  private paymentMethod: TPaymentMethod;
  private address: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._container = container;
  }

  validate(): void {
    this.validForm();
  }

  render(data?: Partial<IPayForm>): HTMLElement {
      if (data) {
        Object.assign(this, data);
      }


      const localContainer = document.createElement('div');
      const template = document.getElementById('order') as HTMLTemplateElement;
      if (template && template.content) {
          localContainer.appendChild(template.content.cloneNode(true));
      }

      this._container = localContainer;

      this.initializeElements();
      this.attachEventListeners();

      return this._container;
  }

  private initializeElements(): void {
  
    this.formElement = this._container.querySelector('form[name="order"]') as HTMLFormElement;
    this.onlineButton = this.formElement.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = this.formElement.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = this.formElement.querySelector('input[name="address"]') as HTMLInputElement;
    this.submitButton = this.formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorSpan = this.formElement.querySelector('.form__errors') as HTMLElement;

    if (this.paymentMethod === 'card') {
      this.toggleClass(this.onlineButton, 'button_alt-active', true);
    } else {
      this.toggleClass(this.cashButton, 'button_alt-active', true);
    }

    if (this.address) {
      this.addressInput.value = this.address;
    }

    this.setDisabled(this.submitButton, true);
  }

  private attachEventListeners(): void {
    this.onlineButton.addEventListener('click', () => {
      this.setPaymentMethod('card');
    });

    this.cashButton.addEventListener('click', () => {
      this.setPaymentMethod('cash');
    });


    this.addressInput.addEventListener('input', () => {
      this.address =  this.addressInput.value.trim();
      this.validForm();
    });

    this.formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.events.emit('payForm_submit', { payment: this.paymentMethod, address: this.address });
    });
  }

  private setPaymentMethod(method: 'card' | 'cash'): void {
    this.paymentMethod = method;

    if (method === 'card') {
      this.toggleClass(this.onlineButton, 'button_alt-active', true);
      this.toggleClass(this.cashButton, 'button_alt-active', false);
    } else {
      this.toggleClass(this.onlineButton, 'button_alt-active', false);
      this.toggleClass(this.cashButton, 'button_alt-active', true);
    }
    this.validForm();
  }
  private validForm(): void {
    const isAddressValid = this.address.length > 0;
    const isPaymentValid = this.paymentMethod !== null;

    if (isAddressValid && isPaymentValid) {
      this.setDisabled(this.submitButton, false);
      this.setText(this.errorSpan, '');
    } else {
      this.setDisabled(this.submitButton, true);
    }

    if (!isAddressValid) {
      this.setText(this.errorSpan, 'Введите адрес доставки');
    }
  }
}
