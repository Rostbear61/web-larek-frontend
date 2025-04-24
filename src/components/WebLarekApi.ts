import { Api } from './base/api';
import { TResponseProductList,
TResponseProductItem, 
TSendProduct, 
TResponseOrder} from '../types/index';

export class WebLarekApi extends Api {
    getItemsList() {
        return this.get('/product/') as Promise<TResponseProductList>;
    }
    getProduct(id: string): Promise<TResponseProductItem> {
        throw 'not implemented yet';
    }
    postOrder(order: TSendProduct): Promise<TResponseOrder> {
        return this.post('/order/', order) as Promise<TResponseOrder>;
    }

}