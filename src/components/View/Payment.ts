import { Form } from './Form';
import { IPayForm, TPaymentMethod } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements, ensureElement } from '../../utils/utils';

export class Payment extends Form<IPayForm> {
	protected _buttons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this._buttons.forEach((button) =>
			button.addEventListener('click', () =>
				this.events.emit('payment:change', { payment: button.name })
			)
		);
	}

	set payment(value: TPaymentMethod) {
		this._buttons.forEach((button) => {
			if (button.name === value) {
				this.toggleClass(button, 'button_alt-active', true);
			} else {
				this.toggleClass(button, 'button_alt-active', false);
			}
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
