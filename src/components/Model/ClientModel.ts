import { IClientModel, IEvents, TPaymentMethod } from '../../types';
import { settings } from '../../utils/constants';
interface ValidationResult {
	isValid: boolean;
	message?: string;
}

export class ClientModel {
	private _payment: TPaymentMethod;
	private _address: string;
	private _phone: string;
	private _email: string;
	constructor(events: IEvents) {
		this._payment = 'card';
		this._address = '';
		this._phone = '';
		this._email = '';
	}

	get payment(): TPaymentMethod {
		return this._payment;
	}

	get address(): string {
		return this._address;
	}

	get phone(): string {
		return this._phone;
	}

	get email(): string {
		return this._email;
	}

	set payment(value: TPaymentMethod) {
		this._payment = value;
	}

	set address(value: string) {
		this._address = value;
	}

	set phone(value: string) {
		this._phone = value;
	}

	set email(value: string) {
		this._email = value;
	}

	clearAll() {
		this._payment = 'card';
		this._address = '';
		this._phone = '';
		this._email = '';
	}

	getAllData(): IClientModel {
		return {
			payment: this._payment,
			address: this._address,
			phone: this._phone,
			email: this._email,
		};
	}

	isValidAdress(): ValidationResult {
		const isValid = this._address.trim().length > 0;
		return {
			isValid,
			message: isValid ? '' : settings.adressValidateMessage,
		};
	}
	isValidClient(): ValidationResult {
		const emailValid = this.validateEmail(this._email);
		const phoneValid = this.validatePhone(this._phone);

		if (!emailValid && !phoneValid) {
			return {
				isValid: false,
				message: `${settings.emailValidateMessage} и ${settings.phoneValidateMessage}`,
			};
		} else if (!emailValid) {
			return { isValid: false, message: settings.emailValidateMessage };
		} else if (!phoneValid) {
			return { isValid: false, message: settings.phoneValidateMessage };
		}
		return { isValid: true, message: '' };
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
