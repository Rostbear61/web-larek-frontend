import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Presenter } from './components/Presenter';
import { IProduct, IServerAnswer, TPaymentMethod } from './types';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const presenter = new Presenter(events);

api
	.getProductList()
	.then((data) => presenter.updateCatalog(data))
	.catch((err) => {
		console.log(err);
	});

events.on('catalog_update', (data: IProduct[]) => {
	presenter.showCard(data);
});
events.on('card_click', (card: IProduct) => {
	presenter.openCardModal(card);
});

events.on('card_buy', (card: IProduct) => {
	presenter.basketAdd(card);
	presenter.openCardModal(card);
});
events.on('card_remove', (card: IProduct) => {
	presenter.basketRemove(card);
	presenter.openCardModal(card);
});

events.on('open_modal', () => {
	presenter.pageScrollLock();
});
events.on('close_modal', () => {
	presenter.pageScrollUnlock();
});

events.on('basket_changed', () => {
	presenter.UpdateBasketCount();
});

events.on('open_basket', () => {
	presenter.openBasket();
});

events.on('basket_delete', (product: IProduct) => {
	presenter.basketRemove(product);
	presenter.openBasket();
});

events.on('basket_order', () => {
	presenter.openPayForm();
});
events.on('payment:change', (data: { payment: TPaymentMethod }) => {
	presenter.updatePaymentInfo(data.payment);
});
events.on('order.address:change', (data: {field: string, value: string}) => {
    presenter.updateAdressInfo(data.value);});

events.on('order:submit', () => {
    presenter.openContactForm();
});

events.on('contacts.email:change', (data: {field: string, value: string}) => {
    presenter.updateEmailInfo(data.value);
});


events.on('contacts.phone:change', (data: {field: string, value: string}) => {
    presenter.updatePhoneInfo(data.value);
});

events.on('contacts:submit', () => {
    api.postOrder(presenter.sendOrder())
    .then((data) => 
        presenter.openSuccess(data)
    );
})


/*
events.on('payForm_submit', (data) => {
    presenter.updatePayInfo(data);
    presenter.openContactForm();
});
events.on('contactsForm_submit', (data) => {
    presenter.updateContactsInfo(data);
    
}); 
events.on('close_success', () => {
    presenter.closeModal();
});*/
