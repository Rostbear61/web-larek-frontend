import { Component } from '../base/Component';
import { IEvents, IContacts } from '../../types';

export class ContactsForm extends Component<IContacts> {
  private formElement: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorSpan: HTMLElement;
  private _container: HTMLElement;
  private email: string;
  private phone: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._container = container;
  }

   validate(): void {
    this.validForm();
  }

  render(data?: Partial<IContacts>): HTMLElement {
    if (data) {
      
      Object.assign(this, data);
    }

    const localContainer = document.createElement('div');
    const template = document.getElementById('contacts') as HTMLTemplateElement;
    if (template && template.content) {
      localContainer.appendChild(template.content.cloneNode(true));
    }

    this._container = localContainer;

    this.initializeElements();
    this.attachEventListeners();

    return this._container;
  }

  private initializeElements(): void {
    this.formElement = this._container.querySelector('form[name="contacts"]') as HTMLFormElement;
    this.emailInput = this.formElement.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.formElement.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = this.formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorSpan = this.formElement.querySelector('.form__errors') as HTMLElement;

    if (this.email) {
      this.emailInput.value = this.email;
    }
    if (this.phone) {
      this.phoneInput.value = this.phone;
    }

    this.setDisabled(this.submitButton, true);
  }

  private attachEventListeners(): void {
    this.emailInput.addEventListener('input', () => {
    this.email = this.emailInput.value.trim();
    this.validForm();
    });

    this.phoneInput.addEventListener('input', () => {
      this.phone = this.phoneInput.value.trim();
      this.validForm();
    });

    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contactsForm_submit', { email: this.email, phone: this.phone });
    });
  }


  private validForm(): void {
    const emailValid = this.validateEmail(this.email);
    const phoneValid = this.validatePhone(this.phone);

    if (emailValid && phoneValid) {
      this.setDisabled(this.submitButton, false);
    } else {
      this.setDisabled(this.submitButton, true);
      this.setText(this.errorSpan, '');
    }

    if (emailValid && phoneValid) {
      this.setText(this.errorSpan, '');
    } else {
      if (!emailValid && phoneValid) {
      this.setText(this.errorSpan, 'Введите корректный email');
      }
      if(!phoneValid && emailValid) {
        this.setText(this.errorSpan, 'Введите корректный номер телефона');
      }
      if(!emailValid && !phoneValid) {
        this.setText(this.errorSpan, 'Введите корректный номер телефона и email');
      }
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  }

 
}