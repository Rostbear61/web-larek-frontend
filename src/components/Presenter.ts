import {
	IEventEmiter,
	IEvents,
	IProduct,
	IServerAnswer,
	IPageView,
	IBasketModel,
	IPayForm,
	IContacts,
	ISendOrder,
	TResponseOrder,
	TPaymentMethod,
} from '../types';
import { CatalogModel } from './Model/CatalogModel';
import { Modal } from './View/Modal';
import { BasketModel } from './Model/BasketModel';
import { Payment } from './View/Payment';
import { Contacts } from './View/Contacts';
import { ClientModel } from './Model/ClientModel';
import { Page } from './View/Page';
import { Card } from './View/Card';
import { Basket } from './View/Basket';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Success, ISuccessActions } from './View/Success';

export class Presenter {
	private catalogModel: CatalogModel;
	private modal;
	private basketModel: IBasketModel;
	private basket;
	private payment;
	private contacts;
	private clientModel;
	private _sendOrder: ISendOrder;
	private page;
	private success;

	constructor(private events: IEventEmiter & IEvents) {
		this.catalogModel = new CatalogModel(this.events);
		this.modal = new Modal(document.querySelector('.modal'), this.events);
		this.basketModel = new BasketModel(this.events);
		this.clientModel = new ClientModel(this.events);
		this.page = new Page(document.querySelector('.page__wrapper'), this.events);
		this.basket = new Basket(
			cloneTemplate<HTMLElement>('#basket'),
			this.events
		);
		const formOrder = cloneTemplate<HTMLFormElement>('#order');
		this.payment = new Payment(formOrder, this.events);
		const formClient = cloneTemplate<HTMLFormElement>('#contacts');
		this.contacts = new Contacts(formClient, this.events);

		const successView = cloneTemplate<HTMLFormElement>('#success');
		let actions: ISuccessActions = {
			onClick: () => {
				this.modal.close();
			},
		};
		this.success = new Success(successView, actions);
	}

	updateCatalog(data: IProduct[]) {
		this.catalogModel.setProduct(data);
	}

	showCard(products: IProduct[]) {
		this.page.catalog = this.createCardsFromProducts(products);
	}

	createCardsFromProducts(products: IProduct[]): HTMLElement[] {
		const cards: HTMLElement[] = [];
		products.forEach((product) => {
			const container = cloneTemplate<HTMLElement>('#card-catalog');
			const card = new Card(container, product, this.events);
			card.category = product.category;
			card.title = product.title;
			card.price = product.price;
			card.image = product.image;
			cards.push(container);
		});

		return cards;
	}

	openCardModal(product: IProduct) {
		const container = cloneTemplate<HTMLElement>('#card-preview');
		const card = new Card(container, product, this.events);
		card.category = product.category;
		card.title = product.title;
		card.price = product.price;
		card.image = product.image;
		card.description = product.description;
		card.productInBasket = this.basketModel.checkItem(product.id);
		this.modal.render({ content: card.render() });
	}

	pageScrollLock() {
		this.page.locked = true;
	}

	pageScrollUnlock() {
		this.page.locked = false;
	}

	basketAdd(product: IProduct) {
		this.basketModel.addItem(product.id, product.price);
	}
	basketRemove(product: IProduct) {
		this.basketModel.removeItem(product.id, product.price);
	}

	UpdateBasketCount() {
		this.page.counter = this.basketModel.getItemsCount();
	}

	openBasket() {
		const itemIds: string[] = this.basketModel.getItems();
		const productsInBasket: IProduct[] = itemIds
			.map((id) => this.catalogModel.findProductById(id))
			.filter((product) => product !== undefined) as IProduct[];
		this.basket.total = this.basketModel.getTotalPrice();
		this.basket.selected = this.basketModel.getItems();
		let index = 0;
		let arrayCatalog: HTMLElement[] = productsInBasket.map((product, index) => {
			return this.orderProductCatalog(product, index);
		});
		this.basket.items = arrayCatalog;
		this.modal.render({ content: this.basket.render() });
	}

	orderProductCatalog(product: IProduct, number: number): HTMLElement {
		const container = cloneTemplate<HTMLElement>('#card-basket');
		const indexSpan = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);
		indexSpan.textContent = (number + 1).toString();
		const titleSpan = ensureElement<HTMLElement>('.card__title', container);
		titleSpan.textContent = product.title;
		const priceSpan = ensureElement<HTMLElement>('.card__price', container);
		if (product.price !== null) {
			priceSpan.textContent = `${product.price} синапсов`;
		} else {
			priceSpan.textContent = 'Бесценно';
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

	openPayForm() {
		const validation = this.clientModel.isValidAdress();
		this.modal.render({
			content: this.payment.render({
				payment: this.clientModel.payment,
				address: this.clientModel.address,
				valid: validation.isValid,
				errors: [validation.message],
			}),
		});
	}

	updatePaymentInfo(data: TPaymentMethod) {
		this.clientModel.payment = data;
		const validation = this.clientModel.isValidAdress();
		this.modal.render({
			content: this.payment.render({
				payment: this.clientModel.payment,
				address: this.clientModel.address,
				valid: validation.isValid,
				errors: [validation.message],
			}),
		});
	}
	updateAdressInfo(data: string) {
		this.clientModel.address = data;
		const validation = this.clientModel.isValidAdress();
		this.payment.valid = validation.isValid;
		this.payment.errors = validation.message;
	}

	openContactForm() {
		const validation = this.clientModel.isValidClient();
		this.modal.render({
			content: this.contacts.render({
				phone: this.clientModel.phone,
				email: this.clientModel.email,
				valid: validation.isValid,
				errors: [validation.message],
			}),
		});
	}

	updatePhoneInfo(data: string) {
		this.clientModel.phone = data;
		const validation = this.clientModel.isValidClient();
		this.contacts.valid = validation.isValid;
		this.contacts.errors = validation.message;
	}

	updateEmailInfo(data: string) {
		this.clientModel.email = data;
		const validation = this.clientModel.isValidClient();
		this.contacts.valid = validation.isValid;
		this.contacts.errors = validation.message;
	}
	sendOrder() {
		const productInBacket = this.basketModel.getItems();
		const allProducts = this.catalogModel
			.getAllProducts()
			.map((item) => item.id);
		const productNotPrice = allProducts.filter(
			(item) => this.catalogModel.findProductById(item).price === null
		);
		const filteredBasket = productInBacket.filter(
			(item) => !productNotPrice.includes(item)
		);
		const data = this.clientModel.getAllData();

		this._sendOrder = {
			address: data.address,
			email: data.email,
			phone: data.phone,
			payment: data.payment,
			items: filteredBasket,
			total: this.basketModel.getTotalPrice(),
		};
		return this._sendOrder;
	}
	openSuccess(data: TResponseOrder) {
		if ('total' in data) {
			this.success.total = data.total;
			this.modal.render({ content: this.success.render() });
			this.clientModel.clearAll();
			this.basketModel.clearAll();
		}
	}
	closeModal() {
		this.modal.close;
		this.pageScrollUnlock();
	}
}
