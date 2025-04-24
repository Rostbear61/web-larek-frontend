export type TResponseProductList = IProduct;
export type TResponseProductItem = IProduct | { error: 'NotFound' };
export type TSendProduct = ISendOrder | { error: string }
export type TResponseOrder = TAnswerOrder | { error: string };
export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type TPaymentMethod = 'card' | 'cash'; 
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
eventName: string,
data: unknown
};
export type TAnswerOrder = { id: string; total: number };
export interface IEvents { 
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

export interface IProduct {
    id: string; 
    category: string;
    title: string; 
    image: string; 
    description: string; 
    price: number | null; 
}

export interface ISendOrder {
    "payment": TPaymentMethod,
    "email": string,
    "phone": string,
    "address": string,
    "total": number,
    "items": string[];
}

export interface IFormState { 
    valid: boolean; 
    errors: string[]; 
}

export interface IBasketView {
    items: HTMLElement[];
    total: number |null;
    valid: boolean;
}

export interface IPageView {
	set basketCount(value: number);
	set scrollState(value: boolean);
}

export interface IContacts{
	phone: string;
	email: string;
}

export interface IPayment{
	payment: TPaymentMethod,
	address: string,
}

export interface IOrderForm {
	payment: TPaymentMethod;
	address: string;
}

export interface ICatalogModel {
	items: IProduct[];
	findProductById(id: string): IProduct;
}

export interface ISuccess {
	total: number;
}

export interface IModalData {
    content: HTMLElement ;
}

export interface IBasket {
	items: Set<string>;
}

export interface IBasketModel {
	items: Set<string>;
	add(id: string): void;
	remove(id: string): void;
	getTotal(catalog: ICatalogModel): number|null;
}

export interface IOrder extends IContacts, IPayment {
	total: number;
	items: string[];
}