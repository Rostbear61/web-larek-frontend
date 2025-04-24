import { CatalogModel } from "./Model/CatalogModel";
import { ContactModel } from "./Model/ContactModel";
import { CatalogView } from "./View/CatalogView";
import { ContactForm } from "./View/ContactsForm";
import { PaymentForm } from "./View/PayForm";
import { SuccessView } from "./Success";
import { BasketModel } from "./Model/BasketModel";
import { PaymentModel } from "./Model/PaymentModel";
import { BasketView } from "./View/BasketView";
import { PageView } from "./View/PageView";
import { Modal } from "./Modal";
import { CardView } from "./View/CardView";
import { IContacts, IEventEmiter, IEvents, IOrder, IPageView, IPayment, IProduct } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";


export class Presenter {
    private catalogModel: CatalogModel;
    private basketModel: BasketModel;
    private paymentModel: PaymentModel;
    private contactModel: ContactModel
    private paymentForm: PaymentForm;
    private contactForm: ContactForm;
    private successView: SuccessView;
    private modal: Modal;
    private basketView: BasketView; 
    private catalogView: CatalogView;
    private currentCardView?: CardView;
    private pageView: IPageView;

    constructor(private events: IEventEmiter & IEvents) {
        this.catalogModel = new CatalogModel(events);
        this.basketModel = new BasketModel(events);
        this.paymentModel = new PaymentModel(events);
        this.contactModel = new ContactModel(events);
        this.paymentForm = new PaymentForm(events);
        this.contactForm = new ContactForm(events);
        this.catalogView = new CatalogView(events);
        this.successView = new SuccessView(events);
        this.pageView = new PageView(
            ensureElement<HTMLElement>('.page__wrapper'), 
            events,
            () => {
                this.modal.render({content: this.renderBasket()})
            } 
        );
        this.modal = new Modal(
            ensureElement<HTMLElement>('#modal-container'),
            events
        );
        this.basketView = new BasketView(cloneTemplate('#basket'), events);
    }

    renderBasket() {
        this.pageView.basketCount = this.basketModel.items.size;
        if (this.currentCardView) {
            this.currentCardView.render({
                disabledBuy: this.basketModel.items.has(this.currentCardView.id)
            })
        }

        return this.basketView.render({
            total: this.basketModel.getTotal(this.catalogModel),
            valid: this.basketModel.validation(this.catalogModel),
            items: Array.from(this.basketModel.items.values()).map((el, ind) => {
                const product = this.catalogModel.findProductById(el);
                const basketItemView = new CardView(
                    cloneTemplate('#card-basket'),
                    this.events,
                    () => {
                        this.basketModel.remove(product.id);
                        this.renderBasket();
                    }
                );
                return basketItemView.render({
                    index: ind + 1,
                    price: product.price,
                    title: product.title,
                });
            }),
        });
    }

    updateCatalog(json: any) {
        this.catalogModel.items = json.items;
    }

    renderCatalog() {
        const itms = this.catalogModel.items.map((product) => {
            const cardView = new CardView(
            cloneTemplate('#card-catalog'), 
            this.events,
            () => {
                this.events.emit('card:click', product);
            });
            return cardView.render(product);
        });
        this.catalogView.render({items: itms});
    }

    openCard(product: IProduct) {
        this.currentCardView = new CardView(
            cloneTemplate('#card-preview'),
            this.events,
            () => {
                this.basketModel.add(product.id);
                this.pageView.basketCount = this.basketModel.items.size;
            }
        );
        this.modal.render({
            content: this.currentCardView.render({
                ...product,
                disabledBuy: this.basketModel.items.has(product.id),
            }),
        });
    }

    lockedWrapper() {
        this.pageView.scrollState = true;
    }
    unlockedWrapper() {
        this.pageView.scrollState = false;
    }

    buildOrder() : IOrder {
        return {
            items: Array.from(this.basketModel.items.values()),
            address: this.paymentModel.address,
            payment: this.paymentModel.payment,
            phone: this.contactModel.phone,
            email: this.contactModel.email,
            total: this.basketModel.getTotal(this.catalogModel),
        };
    }

    renderAnswer(total: number) {
        this.modal.render({
            content: this.successView.render({total: total})
        });
        this.contactModel.reset();
        this.paymentModel.reset();
        this.basketModel.reset();
    }

    closeModal() {
        this.modal.close();
        
    }

    openPayment() {
        this.modal.render({content: this.renderPayment() });
    }

    openContact() {
        this.modal.render({content: this.renderContacts() });
    }

    updatePayment(field: keyof IPayment, value: any) {
        const mixin = {[field]: value};
        Object.assign(this.paymentModel, mixin);
        if (field === 'payment') {
            this.modal.render({content: this.renderPayment()});
        }
    }



    renderPayment(): HTMLElement {
        const errors = this.paymentModel.validate();
        return this.paymentForm.render({
            payment: this.paymentModel.payment,
            address: this.paymentModel.address,
            errors: errors,
            valid: errors.length == 0,
        });
    }

    renderContacts(): HTMLElement {
        const errors = this.contactModel.validate();
        return this.contactForm.render({
            email: this.contactModel.email,
            phone: this.contactModel.phone,
            errors: errors,
            valid: errors.length == 0,
        });
    }
    updateContacts(field: keyof IContacts, value: any) {
        const mixin = {[field]: value};
        Object.assign(this.contactModel, mixin);
        if (field === 'email' || field === 'phone') {
            this.renderContacts()};
    }
}