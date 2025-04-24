# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Список событий в приложении
Проект состоит из:
- Главная страница, содержит: лого, табличка с кнопками карточек товаров, кнопку корзины с цифровым экраном кол-ва товаров в ней(корзине);
- Модальное окно товара, содержит: картинку товара, категорию, название, описание, цену, кнопку закрыть модальное окно и кнопку купить;
- Модальное окно корзины, содержит: заголовок, таблицу с добавленными товарами (номер по порядку, название товара и цену), кнопку закрыть модальное окно, кнопку "Оформить" и итоговую сумму товаров;
- Модальное окно формы оплаты, содержит: кнопки выбора способа оплаты ("Онлайн" и "При получении"), поле ввода "Адреса доставки", кнопку закрыть модальное окно и кнопку "Далее";
- Модальное окно форма контактов, содержит: поле ввода почты, поле ввода телефона, кнопку закрыть модальное окно и кнопку "Оплатит";
- Модальное окно успешной покупки, содержит: Логотип, информацию, сумму заказа, кнопку закрыть модальное окно и кнопку "за новыми покупками!"

## Используемый архитектурный паттерн
Проект выполнен на основе MVC-паттерна(Model-View-Controller).

## Типы данных и интерфейсы

type TResponseProductList = ApiListResponse<IProduct>; - каталог товаров полученных с сервера и общее кол-во товаров

type TResponseProductItem = IProduct | { error: 'NotFound' }; 

type TSendProduct = ISendOrder | { error: string }

type TResponseOrder = { id: string; total: number } | { error: string }; 

type EmitterEvent = {
 -   eventName: string,
 -   data: unknown
};

type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил'; - категории товаров

type TPaymentMethod = 'card' | 'cash'; - тип оплаты

type Partial<T> = {
 -   [P in keyof T]?: T[P];
}

type EventName = string | RegExp;

type Subscriber = Function;

type TAnswerOrder = { id: string; total: number };

interface IEvents {
 -   on<T extends object>(event: EventName, callback: (data: T) => void): void;
 -   emit<T extends object>(event: string, data?: T): void;
 -   trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

interface IEventEmiter {
-	emit: (event: string, data: unknown) => void;
}

interface IProduct {
-	id: string; - id товара;
-    category: string; - категория товара;
-    title: string; - название товара;
-    image: string; - картинка товара;
-	description: string; - описание товара;
-	price: number | null; - стоимость товара;
}

interface ISendOrder {
-	"payment": string,
-    "email": string,
-    "phone": string,
-    "address": string,
-    "total": number,
-    "items": string[]
}

interface IFormState {
 -   valid: boolean;
 -   errors: string[];
}

interface IBasketView {
-    items: HTMLElement[];
-    total: number |null;
-    valid: boolean;
}

interface IPageView {
-	set basketCount(value: number);
-	set scrollState(value: boolean);
}

interface IContacts{
-	phone: string;
-	email: string;
}

interface IPayment{
-	payment: TPaymentMethod,
-	address: string,
}

interface IOrderForm {
-	payment: TPaymentMethod;
-	address: string;
}

interface ICatalogModel {
-	items: IProduct[];
-	findProductById(id: string): IProduct;
}

interface ISuccess {
-	total: number;
}

interface IModalData {
 -   content: HTMLElement ;
}

interface IBasket {
-	items: Set<string>;
}

interface IBasketModel {
-	items: Set<string>;
-	add(id: string): void;
-	remove(id: string): void;
-	getTotal(catalog: ICatalogModel): number|null;
}

interface IOrder extends IContacts, IPayment {
-	total: number;
-	items: string[];
}

## Базовый код
class Api {
-	readonly baseUrl: string;
-	protected options: RequestInit;
-	constructor(baseUrl: string, options: RequestInit = {}) ;
-	protected handleResponse(response: Response): Promise<object> ;
-	get(uri: string) ;
-	post(uri: string, data: object, method: ApiPostMethods = 'POST') ;
}

abstract class Component<T> {
-	protected constructor(protected readonly container: HTMLElement);
-	toggleClass(element: HTMLElement, className: string, force?: boolean);
-	protected setText(element: HTMLElement, value: unknown);
-	setDisabled(element: HTMLElement, state: boolean) ;
-	protected setHidden(element: HTMLElement) ;
-	protected setVisible(element: HTMLElement) ;
-	protected setImage(element: HTMLImageElement, src: string, alt?: string) ;
-	render(data?: Partial<T>): HTMLElement .
}

class EventEmitter implements IEvents {
-	_events: Map<EventName, Set<Subscriber>>;
-	on<T extends object>(eventName: EventName, callback: (event: T) => void) ;
-	off(eventName: EventName, callback: Subscriber) ;
-	emit<T extends object>(eventName: string, data?: T) ;
-	onAll(callback: (event: EmitterEvent) => void) ;
-	offAll() ;
-	trigger<T extends object>(eventName: string, context?: Partial<T>) .
}

abstract class Model<T> {
-	constructor(data: Partial<T>, protected events: IEvents);
-	emitChanges(event: string, payload?: object) .
}

class Form<T> extends Component<T>
- 	protected _submit;
-	protected _errors;
-	protected onInputChange;
-	set valid;
-	set errors;
-	render.

class Modal extends Component<IModalData> {
-    protected _closeButton: HTMLButtonElement;
-    protected _content: HTMLElement;
-    set content(value: HTMLElement);
-    open();
-    close();
-    render(data: IModalData) : HTMLElement.
}

class SuccessView extends Component<ISuccess> {
-    private description: HTMLElement;
-    set total(value: number).
}

## Модель данных

class CatalogModel - реализует интерфейс ICatalogModel. Содержит каталог полученных товаров. Методы:
- setItems - записывает каталог продуктов
- getItems - возвращяет каталог продуктов
- findProductById - возвращает продукт по id

class BasketModel - реализует интерфейс IBasketModel наследует от Model<IBasket>. Содержит список товаров, которые добавлены в корзину и их кол-во. Методы:
- add - добавление товара;
- remove - убрать товар;
- validation - 
- reset - очистить от всех товаров;
- getTotal - стоимость всех товаров в корзине.

class ContactModel - наследует от Model<IContacts>. Методы :
- reset - сброс значений телефона и почтового адреса;
- set email - записать почтовый адрес;
- set phone - записать телефон;
- get phone - записать телефон;
- get email - записать почтовый адрес;


class PaymentModel - наследует от Model<IPayment>. Методы :
- validate - валидация форм;
- reset - сброс значений телефона и почтового адреса;
- set payment - записать способ оплаты ;
- set adress - записать адрес;
- get payment - записать способ оплаты;
- get adress - записать адрес;

## Компоненты представления

class BasketView - наследует от Component<IBasketView> Отображение корзины. Методы:
- set items - отображение списка с товарами либо надписи "Корзина пуста";
- set valid - 

class CardView - наследует от Component<IProduct...>. Отображение одной карточки и отслеживание добавление товара в корзину. Методы:
- set disabledBuy - блокировка кнопки купить;
- set title - записать заголовок;
- set price - записать цену;
- set description - записать описание;
- set category - записать категорию;
- set image - записать картинку;
- set index - записать индекс.

class CatalogView - наследует от Component<{items: HTMLElement[]}>. Отображение каталога карточек на главной странице. Метод:
- set items - .

class PageView - наследует от Component<IPageView>. Отображение кол-ва товаров в корзине и блокировка прокрутки при открытии модального окна. Методы:
- set basketCount - отобразить кол-во товаров на странице; 
- set scrollState - блакировка прокрутки.

class ContactsForm - наследует от Form<IContact>. Запись почты и телефона. Методы:
- set phone;
- set email.


class PayForm - наследует от Form<IPayment>. Запись способа оплаты и адреса доставки. Методы:
- set address - ;
- set payment - .
## Презентер

class Presenter - отвечает за связь между моделями данных и компонентами представления. Методы:
- renderBasket - отрисовка корзины;
- updateCatalog - запись полученных с сервера карточек в CatalogModel.
- renderCatalog - отрисовка каталога карточек;
- openCard - открыть карточку;
- lockedWrapper - блокировка прокрутки страницы;
- unlockWrapper - снятие блокировки прокрутки страницы;
- buildOrder - формирует объект для отправки данных для покупки на сервер;
- renderAnswer - открыть модальное окно успешного заказа;
- openPayment - открыть модальное окно оплаты;
- updatePayment - обновляет данные оплаты
- renderPayment - собирает данные для модального окна;
- renderContact - собирает данные для модального окна;
- openContact - открыть модальное окно данных пользователя; 
- updateContact - обновляет данные пользователя
- closeModal - закрыть модальное окно;

## Сервисный класс WebLarekApi 

class WebLarekApi extends Api - класс для получения данных с сервера и отправки данных. Методы:
- getItemsList - получения объекта с товарами с сервера
- getProduct - получения объекта товара по id
- postOrder - отправка списка покупок на сервер
