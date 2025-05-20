import { IProduct,  IEvents} from "../../types";
import {CDN_URL} from "../../utils/constants"
import {transformCategory} from "../../utils/utils"
export class CatalogView {
    
    constructor(protected events: IEvents) {
        this.events = events;
    }
    showProducts(catalog : IProduct[]){
        catalog.forEach((element) => {
            const catalogCard = new ProductCard(element, this.events);
            const cardElement = catalogCard.render();

            document.querySelector('.gallery').appendChild(cardElement);
        })
    }

}

class ProductCard {
    private events : IEvents;
    private data: IProduct;

    constructor(data: IProduct, events: IEvents){
       this.data = data;
       this.events = events;
    }

    private formatPrice() : string {
        if (this.data.price === null){
            return 'Бесценно'
        }
        return `${this.data.price} синопсисов`
    }

    getTemplateData() {
        return {
            id: this.data.id,
            category: this.data.category,
            title: this.data.title,
            image: this.data.image,
            description: this.data.description,
            priceText: this.formatPrice(),
        }
    }

    render(): HTMLElement | null {
        const template = (document.querySelector('#card-catalog') as HTMLTemplateElement).content;
        const cloneTemplate = template.cloneNode(true) as HTMLElement;

        const button = cloneTemplate.querySelector('button');
        button.addEventListener('click', () => {
            this.events.emit('card_click', this.data);
        })
        const category = button.querySelector('.card__category');
        category.textContent = this.data.category;
        const classCategory = transformCategory(this.data.category);
        category.classList.add(`card__category_${classCategory}`);


        const title = button.querySelector('.card__title');
        title.textContent = this.data.title;
        const img = button.querySelector('.card__image') as HTMLImageElement;
        img.src = CDN_URL + this.data.image.replace(".svg" , ".png");
        const price = button.querySelector('.card__price');
        if (price) price.textContent = this.formatPrice();

        return button;
    }

}