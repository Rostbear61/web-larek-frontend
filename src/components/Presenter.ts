import { IEventEmiter, IEvents, IProduct, IServerAnswer, IPageView, IBasketModel, IPayForm, IContacts, ISendOrder, TResponseOrder} from "../types";
import { CatalogModel } from "./Model/CatalogModel";
import { CatalogView } from "./View/CatalogView";
import { PageView } from "./View/PageView"; 
import { Modal } from "./View/Modal";
import { BasketModel } from "./Model/BasketModel";
import {cardModalView} from "./View/CardView"
import { BasketView } from "./View/BasketView";
import { PayForm } from "./View/PayForm";
import { ClientModel } from "./Model/ClientModel";
import { ContactsForm } from "./View/ContactsForm";
import { OrderSuccess } from "./View/Success";

export class Presenter {
    private catalogModel: CatalogModel; 
    private catalogView: CatalogView;
    private pageView: IPageView;
    private modal;
    private basketModel : IBasketModel;
    private basketView;
    private payForm;
    private clientModel;
    private contactsForm;
    private _sendOrder : ISendOrder;
    private success;

    constructor (private events: IEventEmiter & IEvents) {
        this.catalogModel = new CatalogModel(this.events);
        this.catalogView = new CatalogView(this.events);
        this.pageView = new PageView(document.querySelector('.page__wrapper'),this.events);
        this.modal = new Modal(this.events);
        this.basketModel = new BasketModel({},this.events);
        this.basketView = new BasketView(document.getElementById('basket'), this.basketModel, this.events);
        this.payForm = new PayForm(document.getElementById('order'), this.events);
        this.clientModel = new ClientModel({}, this.events);
        this.contactsForm = new ContactsForm(document.getElementById('contacts'), this.events);
        this.success = new OrderSuccess(this.events);
    }

    updateCatalog(data: IServerAnswer){
        this.catalogModel.setProduct(data.items);
    }

    showCard(product: IProduct[]){
        this.catalogView.showProducts(product);
    }

    openCardModal(product: IProduct){
        const productInBacket = this.basketModel.checkItem(product.id);
        const openCard = new cardModalView(product, this.events, productInBacket);
        this.modal.openModal(openCard.render());
        this.pageScrollLock();
    }

    pageScrollLock() {
        this.pageView.scrollState = true;
    }

    pageScrollUnlock(){
        this.pageView.scrollState = false;
    }

    basketAdd(product: IProduct){
        this.basketModel.addItem(product.id);
    }
    basketRemove(product: IProduct){
        this.basketModel.removeItem(product.id);
    }
    openBasket(){
        const itemIds: string[] = this.basketModel.getItems()
        const productsInBasket: IProduct[] = itemIds
            .map(id => this.catalogModel.findProductById(id))
            .filter(product => product !== undefined) as IProduct[];
        this.basketView.update(productsInBasket);
        this.modal.openModal(this.basketView.render());
        this.pageScrollLock();
    }
    UpdateBasketCount(){
        this.pageView.basketCount = this.basketModel.getItemsCount();
    }
    openPayForm(){
        const data = {payment: this.clientModel.payment, address: this.clientModel.address};
        this.modal.openModal(this.payForm.render(data));
        this.payForm.validate();
    }
    updatePayInfo(data: Partial<IPayForm>){
        this.clientModel.payment = data.payment;
        this.clientModel.address = data.address;
    }
    openContactForm(){
        const data = {phone: this.clientModel.phone, email: this.clientModel.email};
        this.modal.openModal(this.contactsForm.render(data));
        this.contactsForm.validate();
    }
    updateContactsInfo(data: Partial<IContacts>){
        this.clientModel.phone = data.phone;
        this.clientModel.email = data.email;
    }
    sendOrder(){
        const productInBacket = this.basketModel.getItems();
        const allProducts = this.catalogModel.getAllProducts().map(item => item.id);
        const productNotPrice = allProducts.filter(item => this.catalogModel.findProductById(item).price === null);
        const filteredBasket = productInBacket.filter(item => !productNotPrice.includes(item));

        const data = this.clientModel.getAllData();
        this._sendOrder = {
            address: data.address,
            email: data.email,
            phone: data.phone,
            payment: data.payment,
            items: filteredBasket,
            total: this.basketView.total
        };
        return this._sendOrder;
    }
    openSuccess(data: TResponseOrder){
        this.modal.openModal(this.success.render(data));
        this.clientModel.clearAll();
        this.basketModel.clearAll();
    }
    closeModal(){
        this.modal.closeModal();
        this.pageScrollUnlock();
    }
}