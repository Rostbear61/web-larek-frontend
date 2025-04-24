import { IContacts, IEvents } from "../../types";
import { Model } from "../base/Model";

export class ContactModel extends Model<IContacts> {
    private _email: string;
    private _phone: string;

    private static getDefault(): IContacts {
        return {email: '', phone: ''};
    }

    constructor(events: IEvents) {
        super(ContactModel.getDefault(), events);
    }

    reset() {
        Object.assign(this, ContactModel.getDefault());
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.email){
            errors.push('Необходимо указать email');
        }
        if (!this.phone) {
            errors.push('Необходимо указать телефон');
        }
        return errors;
    }

    set email(value: string) {
        this._email = value;
        this.emitChanges('contacts:change');
    }

    set phone(value: string) {
        this._phone = value;
        this.emitChanges('contacts: change');
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }
}