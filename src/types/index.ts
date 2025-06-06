import { categoryMap } from '../utils/constants';
export type TSendProduct = ISendOrder | { error: string };
export type TResponseOrder = TAnswerOrder | { error: string };
export type TPaymentMethod = 'card' | 'cash';
export type CategoryKey = keyof typeof categoryMap;
export type EventName = string | RegExp;
export type TAnswerOrder = { id: string; total: number };
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}
export interface IServerAnswer {
	items: IProduct[];
	total: number;
}
export interface IProduct {
	id: string;
	category: CategoryKey;
	title: string;
	image: string;
	description: string;
	price: number | null;
}

export interface ISendOrder {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IContacts {
	phone: string;
	email: string;
}

export interface IPayForm {
	payment: TPaymentMethod;
	address: string;
}

export interface ICatalogModel {
	products: IProduct[];
	findProductById(id: string): IProduct;
}

export interface IBasketModel {
	addItem(id: string): void;
	removeItem(id: string): void;
	checkItem(id: string): boolean;
	getItemsCount(): number;
	clearAll(): void;
	getItems(): string[];
}

export interface IClientModel {
	payment: TPaymentMethod;
	address: string;
	phone: string;
	email: string;
}
