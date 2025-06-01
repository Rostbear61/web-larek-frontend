import { Component } from '../../components/base/Component';
import { IProduct, IEvents, CategoryKey } from '../../types';
import { ensureElement } from '../../utils/utils';
import { transformCategory } from '../../utils/utils';

interface ICard {
	title: string;
	description?: string;
	image: string;
	price: string;
	category: string;
}

export class Card extends Component<ICard> {
	protected cardTitle: HTMLElement;
	protected cardDescription: HTMLElement | null;
	protected cardImage: HTMLImageElement;
	protected cardCategory: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardButton: HTMLButtonElement | null;
	protected cardByeButton: HTMLButtonElement | null;
	protected cardInBasket: boolean | null;

	constructor(
		container: HTMLElement,
		product: IProduct,
		protected events: IEvents
	) {
		super(container);
		this.cardTitle = ensureElement('.card__title', this.container);

		if (this.container.querySelector('.card__text')) {
			this.cardDescription = ensureElement('.card__text', this.container);
		} else {
			this.cardDescription = null;
		}

		this.cardImage = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this.cardCategory = ensureElement('.card__category', this.container);
		this.cardPrice = ensureElement('.card__price', this.container);
		this.cardButton = this.container as HTMLButtonElement;

		this.cardButton.addEventListener('click', () => {
			this.events.emit('card_click', product);
		});
		this.cardByeButton = this.container.querySelector(
			'.button'
		) as HTMLButtonElement;

		if (this.cardByeButton) {
			this.cardByeButton.addEventListener('click', () => {
				if (this.cardInBasket) {
					this.events.emit('card_remove', product);
				} else {
					this.events.emit('card_buy', product);
				}
			});
		}
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set description(value: string) {
		if (this.cardDescription) {
			this.setText(this.cardDescription, value);
		}
	}

	set image(value: string) {
		this.setImage(this.cardImage, value);
	}

	set category(value: CategoryKey) {
		this.setText(this.cardCategory, value);
		this.toggleClass(this.cardCategory, `card__category_${transformCategory(value)}`, true);
	}

	set price(value: number | null) {
		const textPrice = value !== null ? `${value} синапсов` : 'Бесценно';
		this.setText(this.cardPrice, textPrice);
	}

	set productInBasket(value: boolean) {
		this.cardInBasket = value;
		if (value) {
			this.setText(this.cardByeButton, 'Убрать');
		} else {
			this.setText(this.cardByeButton, 'В корзину');
		}
	}
}
