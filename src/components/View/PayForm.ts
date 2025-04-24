import { IEvents, IPayment, TPaymentMethod } from "../../types";
import { Form } from "../Form";
import { cloneTemplate, ensureAllElements } from "../../utils/utils";

export class PaymentForm extends Form<IPayment> {
    protected _paymentButton: HTMLButtonElement[];
    protected _address: HTMLInputElement;

    constructor(events: IEvents) {
        super(cloneTemplate('#order'), events);

        this._paymentButton = ensureAllElements('.button_alt', this.container);
        this._address = this.container.elements.namedItem('address') as HTMLInputElement;

        this._paymentButton.forEach((button) => button.addEventListener('click', () => {
            events.emit('order.pay.change', {payment : button.getAttribute('name')});
            events.emit('order.pay, emt:change', {
                field: 'payment',
                value: button.getAttribute('name'),
            })
        }))

        this._address.addEventListener('input', (evt) => {
            const value = (evt.target as HTMLInputElement).value;
            events.emit('order.address.change', {address : value});
        })
    }

    set address (value: string){
        this._address.value = value;
    }

    set payment(value: TPaymentMethod) {
        this._paymentButton.forEach((button) => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        });
    }
}