import { IPageView, IEvents } from '../../types';
import { Component } from '../base/Component';
export class PageView extends Component<IPageView> implements IPageView {
    private basketCounter: HTMLSpanElement;
    private basketButton: HTMLButtonElement;
    private pageWrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        console.log(container);
        super(container);

        this.basketCounter = this.container.querySelector('.header__basket-counter') as HTMLSpanElement;
        this.basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
        this.pageWrapper = container;

        console.log(this.pageWrapper);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('open_basket');
        });
    }

    set basketCount(value: number) {
        this.basketCounter.textContent = String(value);
    }

    set scrollState(value: boolean) {
        if (this.pageWrapper) {
            if (value) {
                this.toggleClass(this.pageWrapper, 'page__wrapper_locked', true);
            } else {
                this.toggleClass(this.pageWrapper, 'page__wrapper_locked', false);
            }
        }
    }
}

