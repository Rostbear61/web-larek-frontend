import { TResponseOrder, IEvents} from '../types';
export class OrderSuccess {

    constructor(protected events: IEvents){

    }
  
  render(orderData: TResponseOrder): HTMLElement {
    if ('total' in orderData) {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="order-success">
        <h2 class="order-success__title">Заказ оформлен</h2>
        <p class="order-success__description">Списано ${orderData.total} синапсов</p>
        <button class="button order-success__close">За новыми покупками!</button>
      </div>
    `.trim();

    template.content.querySelector('.order-success__close').addEventListener('click', () => {
        
        this.events.emit('close_success');
    });

    return template.content.firstElementChild as HTMLElement;
    } else {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="order-error">
            <h2 class="order-error__title">Ошибка заказа</h2>
            <p class="order-error__message">${orderData.error}</p>
            </div>
        `.trim();
        return template.content.firstElementChild as HTMLElement;
        }
    }
}
