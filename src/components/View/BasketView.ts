import { Component } from '../base/Component';
import { IBasket, IBasketView, IEvents, IBasketModel, IProduct} from '../../types';

export class BasketView extends Component<IBasket> implements IBasketView {
    items: HTMLElement[] = [];
    total: number | null = null;
    valid: boolean = false;
    private template: HTMLTemplateElement;
    private basketElement: HTMLElement;
    private listContainer: HTMLElement;
    private totalElement: HTMLElement;
    private button: HTMLButtonElement;
    constructor(container: HTMLElement, private model: IBasketModel, protected events: IEvents) {
        super(container);
        const template = document.getElementById('basket') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template with id "basket" not found');
        }
        this.template = template;
        const clone = this.template.content.cloneNode(true) as DocumentFragment;
        this.basketElement = clone.querySelector('.basket') as HTMLElement;
        this.listContainer = this.basketElement.querySelector('.basket__list') as HTMLElement;
        this.totalElement = this.basketElement.querySelector('.basket__price') as HTMLElement;
        this.button = this.basketElement.querySelector('.basket__button') as HTMLButtonElement;
        this.button.addEventListener('click', () => {
            this.events.emit('basket_order');
        });
        this.render();
    }

    update(data : IProduct[]) {
        const templateCard = document.getElementById('card-basket') as HTMLTemplateElement;
    this.listContainer.innerHTML = ''; // очищаем список
    this.items = [];
    let totalCount = 0;
    if(data.length > 0) {
    data.forEach(product => {
        // Клонируем шаблон
        totalCount += product.price ?? 0;
        const cloneCard = templateCard.content.cloneNode(true) as DocumentFragment;
        const li = cloneCard.querySelector('.basket__item') as HTMLElement;

        // Заполняем номер (можно использовать индекс + 1)
        const indexSpan = li.querySelector('.basket__item-index') as HTMLElement;
        indexSpan.textContent = (this.items.length + 1).toString();

        // Заполняем название товара
        const titleSpan = li.querySelector('.card__title') as HTMLElement;
        titleSpan.textContent = product.title;

        // Заполняем цену товара
        const priceSpan = li.querySelector('.card__price') as HTMLElement;
        if (product.price !== null) {
            priceSpan.textContent = `${product.price} синапсов`;
        } else {
            priceSpan.textContent = 'Бесценно';
        }

        // Можно добавить обработчик удаления по кнопке, если нужно
        const deleteButton = li.querySelector('.basket__item-delete') as HTMLButtonElement;
        deleteButton.setAttribute('aria-label', 'удалить');
        deleteButton.onclick = () => {
            // Реализуйте удаление товара из списка при необходимости
            this.events.emit('basket_delete', product);
            //this.removeProduct(product.id);
        };

        // Добавляем элемент в контейнер
        this.listContainer.appendChild(li);
        this.items.push(li);
    });
    } else {
    const span = document.createElement('span');
    span.textContent = 'Товар отсутствует';
    this.listContainer.appendChild(span);
    }
    this.total = totalCount; 
    this.setText(this.totalElement, `${totalCount} синапсов`);
    this.valid = totalCount > 0;
    this.setDisabled(this.button, !this.valid);
    }

    render(data?: Partial<IBasket>): HTMLElement {
        Object.assign(this, data ?? {});
        if (!this.container.contains(this.basketElement)) {
            this.container.appendChild(this.basketElement);
        }
        return this.basketElement;
    }
}
