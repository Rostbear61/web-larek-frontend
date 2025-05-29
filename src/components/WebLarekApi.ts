import { Api } from './base/api';
import {
	TSendProduct,
	TResponseOrder,
	IServerAnswer,
	IProduct,
	TAnswerOrder,
} from '../types/index';

interface IWebLarekApi {
	getProductList(): Promise<IProduct[]>;
	postOrder(order: TSendProduct): Promise<TAnswerOrder>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product/').then((data: IServerAnswer) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}
	postOrder(order: TSendProduct): Promise<TAnswerOrder> {
		return this.post('/order/', order).then((data: TResponseOrder) => {
			if ('id' in data && 'total' in data) {
				return data;
			} else {
				throw new Error(data.error);
			}
		});
	}
}
