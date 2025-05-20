import { IEvents } from "../types";
export class Modal {

    private modalConteiner = document.querySelector('#modal-container');

    constructor(private events: IEvents) {}

    openModal(content: HTMLElement ){

        this.modalConteiner.classList.add('modal_active');

        const closeButton = this.modalConteiner.querySelector('.modal__close');

        closeButton.addEventListener('click', () => {
            this.closeModal();
            this.events.emit('close_modal');
        })

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
                this.events.emit('close_modal');
            }
        });

        const modalContent = this.modalConteiner.querySelector('.modal__content');
        if(modalContent){
            modalContent.innerHTML = '';
            modalContent.append(content);
        }
        modalContent.append(content);
    }

    closeModal() {
        this.modalConteiner.classList.remove('modal_active');
    }
    
}