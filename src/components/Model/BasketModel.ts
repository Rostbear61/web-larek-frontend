import { IBasket, IBasketModel, ICatalogModel, IEvents } from "../../types";
import { Model } from "../base/Model";



export class BasketModel extends Model<IBasket> implements IBasketModel {
    items: Set<string>;

    private static getDefault(): IBasket {
        return {items: new Set<string>()};
    }

    constructor(events: IEvents) {
        super(BasketModel.getDefault(), events);
    }

    reset() {
        Object.assign(this, BasketModel.getDefault());
        this.emitChanges('basket:change', this.items);
    }

    getTotal(catalog: ICatalogModel): number|null {
        let result = 0;
        for (let id of Array.from(this.items.values())){
            const price = catalog.findProductById(id).price;
            if (price !== null) {
                result = result + price;
            } else {
                return null;
            }
        }
        return result;
    }

    validation(catalog: ICatalogModel): boolean {
        if(this.items.size == 0) {
            return false;
        }
        for (let id of Array.from(this.items.values())) {
            if (catalog.findProductById(id).price === null) {
                return false;
            }
        }   
        return true;
    }

    add(id: string): void {
        this.items.add(id);
        this.emitChanges('basket:change', this.items);
    }

    remove(id: string): void {
        this.items.delete(id);
        this.emitChanges('basket:change', this.items);
    }

}