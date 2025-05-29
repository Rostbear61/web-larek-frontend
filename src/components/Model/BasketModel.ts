import { IEvents } from '../base/events';

export class BasketModel {
	private _items: string[];
	private _total: number;
	constructor(protected events: IEvents) {
		this._items = [];
		this._total = 0;
	}

	addItem(id: string, price: number) {
		this._items.push(id);
		this.events.emit('basket_changed');
		this._total += price;
	}
	removeItem(id: string, price: number) {
		const index = this._items.indexOf(id);
		if (index !== -1) {
			this._items.splice(index, 1);
			this.events.emit('basket_changed');
		}
		this._total -= price;
	}
	checkItem(id: string): boolean {
		return this._items.includes(id);
	}

	getItemsCount(): number {
		return this._items.length;
	}
	clearAll() {
		this._items = [];
		this._total = 0;
		this.events.emit('basket_changed');
	}
	getItems(): string[] {
		return this._items;
	}
	getTotalPrice(): number {
		return this._total;
	}
}
