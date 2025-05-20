import { IClientModel, IEvents, TPaymentMethod} from "../../types";
import { Model } from "../base/Model";
export class ClientModel extends Model<IClientModel> {
    private _payment : TPaymentMethod;
    private _address : string;
    private _phone : string;
    private _email : string; 
    constructor(data: Partial<IClientModel>, events: IEvents) {
            super(data, events);
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
}
