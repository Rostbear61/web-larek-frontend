import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import {API_URL} from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Presenter } from './components/Presenter';
import { IProduct, IServerAnswer } from "./types";

const api = new WebLarekApi(API_URL);
const events = new EventEmitter();
const presenter = new Presenter(events);

api.getItemsList()
.then((data) => presenter.updateCatalog(data))
.catch(err => {
    console.log(err);
}) 

events.on('catalog_update', (data: IProduct[]) => {
   presenter.showCard(data);
});
events.on('card_click', (card: IProduct) => {
    presenter.openCardModal(card);
});

events.on('card_byu', (card: IProduct) => {
    presenter.basketAdd(card);
    presenter.openCardModal(card);
});
events.on('card_delete', (card: IProduct) => {
    presenter.basketRemove(card);
    presenter.openCardModal(card);
});

events.on('open_modal', () => {
    presenter.pageScrollLock();
});
events.on('close_modal', () => {
    presenter.pageScrollUnlock();
});
events.on('open_basket', () => {
    presenter.openBasket();
});
events.on('basket_changed', () => {
    presenter.UpdateBasketCount();
});

events.on('basket_delete', (product: IProduct) => {
    presenter.basketRemove(product);
    presenter.openBasket();
});

events.on('basket_order', () => {
   presenter.openPayForm();
});

events.on('payForm_submit', (data) => {
    presenter.updatePayInfo(data);
    presenter.openContactForm();
});
events.on('contactsForm_submit', (data) => {
    presenter.updateContactsInfo(data);
    api.postOrder(presenter.sendOrder())
    .then((data) => 
        presenter.openSuccess(data)
    );
}); 
events.on('close_success', () => {
    presenter.closeModal();
});