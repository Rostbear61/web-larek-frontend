import { IContacts, IEvents } from "../../types";
import { Form } from "../Form";
import { cloneTemplate } from "../../utils/utils";


export class ContactForm extends Form<IContacts> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(events: IEvents) {
        super(cloneTemplate('#contacts'), events);

        this._email = this.container.elements.namedItem('email') as HTMLInputElement;
        this._email.addEventListener('input', (evt) => {
            const value = (evt.target as HTMLInputElement).value;
            events.emit('contact.email.change', {field: 'email', value : value});
        })
        this._phone = this.container.elements.namedItem('phone') as HTMLInputElement;
        this._phone.addEventListener('input', (evt) => {
            const value = (evt.target as HTMLInputElement).value;
            events.emit('contact.phone.change', {field: 'phone', value : value});
        })
    }

    set phone (value: string){
        this._phone.value = value;
    }

    set email(value: string) {
        this._email.value = value;
    }
}