import { Api } from './base/api';
import { TSendProduct, TResponseOrder, IServerAnswer} from '../types/index';

export class WebLarekApi extends Api {
    getItemsList() {
        return this.get('/product/') as Promise<IServerAnswer>;
    }
    postOrder(order: TSendProduct): Promise<TResponseOrder> {
        return this.post('/order/', order) as Promise<TResponseOrder>;
    }
}