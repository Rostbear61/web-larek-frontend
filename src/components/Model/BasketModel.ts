import { IBasket } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";

export class BasketModel extends Model<IBasket> {
    private _items : string[];
    constructor(data: Partial<IBasket>, events: IEvents) {
        super(data, events);
        this._items = [];
    }

    addItem(id: string) {
        this._items.push(id);
        this.events.emit('basket_changed');
    }
    removeItem(id: string) {
        const index = this._items.indexOf(id);
        if (index !== -1) {
            this._items.splice(index, 1);
        }
        this.events.emit('basket_changed');
    }
    checkItem(id: string): boolean {
        return this._items.includes(id);
    }
    
    getItemsCount(): number {
        return this._items.length;
    }
    clearAll() {
        this._items = []; 
        this.events.emit('basket_changed');
    }
    getItems() : string[]{
        return this._items;
    }

}