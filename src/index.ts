import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import {API_URL} from './utils/constants';
import { Presenter } from './components/Presenter';
import { EventEmitter } from './components/base/events';
import { IContacts, IPayment, IProduct, TAnswerOrder, TResponseOrder } from './types';


const api = new WebLarekApi(API_URL);
const events = new EventEmitter();
const presenter = new Presenter(events);

api.getItemsList()
.then((data) => presenter.updateCatalog(data))
.catch((error) => console.log(error));

events.on('catalog:change', () => {
    presenter.renderCatalog();
});

events.on('card:click', (event: IProduct) => {
    presenter.openCard(event);
});

events.on('backet:change', () => {
    presenter.renderBasket();
});

events.on('contacts:submit', () => {
    api.postOrder(presenter.buildOrder())
    .then((result : TAnswerOrder ) => {
        
        presenter.renderAnswer(result.total);
    })
    .catch((error) => console.log(error));
});

events.on('successForm:okClick', () => {
    presenter.closeModal(); 
    presenter.renderBasket();
});

events.on('order:open', () => {
    presenter.openPayment();
});

events.on('order:submit', () => {
    presenter.openContact();
})

events.on(/^order\..*:change/, (data: {field: keyof IPayment, value: string}) => {
    presenter.updatePayment(data.field, data.value);
});

events.on('payment: change', () => {
    presenter.renderPayment();   
});

events.on('contact:change', () => {    
    presenter.renderContacts();   
});

events.on(/^contact\..*\..*$/, (data: {field: keyof IContacts, value: string}) => {
    presenter.updateContacts(data.field as keyof IContacts, data.value);
});

events.on('modal:open', () => {
    presenter.lockedWrapper();
});

events.on('modal:close', () => {
    presenter.unlockedWrapper();
});