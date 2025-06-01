import { Component } from '../base/Component';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from '../../utils/utils';
import { IEvents, IProduct } from '../../types';

interface IBasketView {
	total: number;
	selected: string[];
	catalog: IProduct[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _listTemplate: HTMLTemplateElement;

	constructor(
		container: HTMLElement,
		listTemplate: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price') as HTMLElement;
		this._button = this.container.querySelector(
			'.basket__button'
		) as HTMLElement;
		this._listTemplate = listTemplate;

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket_order');
			});
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
	}
	set catalog(productsInBasket: IProduct[]) {
		const arrayCatalog: HTMLElement[] = productsInBasket.map((product, index) => {
			return this.orderProductCatalog(product, index);
		});
		if (arrayCatalog.length) {
			this._list.replaceChildren(...arrayCatalog);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	private orderProductCatalog(product: IProduct, number: number) {
		const container = cloneTemplate(this._listTemplate);
		const indexSpan = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);
		this.setText(indexSpan, (number + 1).toString());
		const titleSpan = ensureElement<HTMLElement>('.card__title', container);
		this.setText(titleSpan, product.title);
		const priceSpan = ensureElement<HTMLElement>('.card__price', container);
		if (product.price !== null) {
			this.setText(priceSpan, `${product.price} синапсов`);
		} else {
			this.setText(priceSpan, 'Бесценно');
		}
		const deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		deleteButton.setAttribute('aria-label', 'удалить');
		deleteButton.onclick = () => {
			this.events.emit('basket_delete', product);
		};
		return container;
	}
}
