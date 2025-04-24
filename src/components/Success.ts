import { IEventEmiter, ISuccess } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";


export class SuccessView extends Component<ISuccess> {
    private description: HTMLElement;

    constructor(private events: IEventEmiter){
        super(cloneTemplate('#success'));

        const button = ensureElement<HTMLElement>('.order-success__close', this.container);
        button.addEventListener('click', () => {
            events.emit('successForm:okClick', {});
        });

        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
    }

    set total(value: number) {
        this.setText(this.description, `Списано ${value} синапсов`);
    }
}