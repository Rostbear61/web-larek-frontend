import { IProduct,  IEvents} from "../../types";
import {CDN_URL} from "../../utils/constants"
import {transformCategory} from "../../utils/utils"

export class cardModalView {
  private product: IProduct;
  protected productInBacket: boolean;

  constructor(product: IProduct, protected events: IEvents, productInBacket: boolean) {
    this.product = product;
    this.productInBacket = productInBacket;
  }

  render(): HTMLElement {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as HTMLElement;
    const card = clone.querySelector('.card_full') as HTMLElement;
    const img = card.querySelector('.card__image') as HTMLImageElement;
    img.src = CDN_URL + this.product.image.replace(".svg" , ".png");
    const categorySpan = card.querySelector('.card__category') as HTMLElement;
    if (categorySpan) {
      categorySpan.textContent = this.product.category;
      const classCategory = transformCategory(this.product.category);
      categorySpan.classList.add(`card__category_${classCategory}`);
    }
    const titleEl = card.querySelector('.card__title') as HTMLElement;
    titleEl.textContent = this.product.title;
    const descEl = card.querySelector('.card__text') as HTMLElement;
    descEl.textContent = this.product.description;
    const priceEl = card.querySelector('.card__price') as HTMLElement;
    priceEl.textContent = this.product.price !== null ? `${this.product.price} синапсов` : 'Бесценно';
    const BuyButton = card.querySelector('.button') as HTMLButtonElement;
    if (this.productInBacket) {
      BuyButton.textContent = 'Убрать';
    } else {
      BuyButton.textContent = 'В корзину';
    }
    BuyButton.addEventListener('click', () => {
      if (this.productInBacket) {
        this.events.emit('card_delete', this.product);
      } else {  
        this.events.emit('card_byu', this.product);
      }
    })
        return clone as HTMLElement
  }
}