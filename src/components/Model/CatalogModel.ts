import { IProduct, ICatalogModel} from "../../types";
import { IEvents } from "../base/events";

export class CatalogModel implements ICatalogModel {

    products: IProduct[] = [];
    constructor (protected events: IEvents ) {
        this.products = [];

    }

    setProduct(products: IProduct[]){
        this.products = products;
        this.events.emit('catalog_update', products);
    }
    
    findProductById(id: string): IProduct {
        return this.products.find(product => product.id === id);
    }

    getAllProducts(): IProduct[] {
        return this.products;
    }

}