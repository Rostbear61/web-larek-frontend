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
Проект состоит из 6-ти экранов:
- Главная страница, содержит: лого, табличка с кнопками карточек товаров, кнопку корзины с цифровым экраном кол-ва товаров в ней(корзине);
- Модальное окно товара, содержит: картинку товара, категорию, название, описание, цену, кнопку закрыть модальное окно и кнопку купить;
- Модальное окно корзины, содержит: заголовок, таблицу с добавленными товарами (номер по порядку, название товара и цену), кнопку закрыть модальное окно, кнопку "Оформить" и итоговую сумму товаров;
- Модальное окно формы оплаты, содержит: кнопки выбора способа оплаты("Онлайн" и "При получении"), поле ввода "Адреса доставки", кнопку закрыть модальное окно и кнопку "Далее";
- Модальное окно форма контактов, содержит: поле ввода почты, поле ввода телефона, кнопку закрыть модальное окно и кнопку "Оплатит";
- Модальное окно успешной покупки, содержит: Логотив, информацию, сумму заказа, кнопку закрыть модальное окно и кнопку "за новыми покупками!"

## Используемый архитектурный паттерн
Проект выполнен на основе MVC-паттерна(Model-View-Controller).

## Типы данных и интерфейсы

type TResponseProductList = ApiListResponse<IProduct>; - каталог товаров полученных с сервера и общее кол-во товаров

type TResponseProductItem = IProduct | { error: 'NotFound' }; 

type TSendProduct = ISendOrder | { error: string }

type TResponseOrder = { id: string; total: number } | { error: string }; 

type EmitterEvent = {
    eventName: string,
    data: unknown
};

type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил'; - категории товаров

type TPaymentMethod = 'card' | 'cash'; - тип оплаты

type Partial<T> = {
    [P in keyof T]?: T[P];
}

type EventName = string | RegExp;

type Subscriber = Function;

type EmitterEvent = {

    eventName: string,

    data: unknown

};

interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

    emit<T extends object>(event: string, data?: T): void;

    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;

}


interface IProduct {

	id: string; - id товара;

    category: string; - категория товара;

    title: string; - название товара;

    image: string; - картинка товара;

	description: string; - описание товара;

	price: number | null; - стоимость товара;

}

interface ISendOrder {

	"payment": string,

    "email": string,

    "phone": string,

    "address": string,

    "total": number,

    "items": Array
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

## Базовый код
class Api {
	readonly baseUrl: string;

	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) 

	protected handleResponse(response: Response): Promise<object> 

	get(uri: string) 

	post(uri: string, data: object, method: ApiPostMethods = 'POST') 

}

abstract class Component<T> {

	protected constructor(protected readonly container: HTMLElement)

	toggleClass(element: HTMLElement, className: string, force?: boolean)

	protected setText(element: HTMLElement, value: unknown)

	setDisabled(element: HTMLElement, state: boolean) 

	protected setHidden(element: HTMLElement) 

	protected setVisible(element: HTMLElement) 

	protected setImage(element: HTMLImageElement, src: string, alt?: string) 

	render(data?: Partial<T>): HTMLElement 

}

class EventEmitter implements IEvents {

	_events: Map<EventName, Set<Subscriber>>

	constructor() 

	on<T extends object>(eventName: EventName, callback: (event: T) => void) 

	off(eventName: EventName, callback: Subscriber) 

	emit<T extends object>(eventName: string, data?: T) 

	onAll(callback: (event: EmitterEvent) => void) 

	offAll() 

	trigger<T extends object>(eventName: string, context?: Partial<T>) 

}

abstract class Model<T> {

	constructor(data: Partial<T>, protected events: IEvents)

	emitChanges(event: string, payload?: object) 

}
## Модель данных

class CatalogModel - содержит каталог полученных товаров. Методы:
- setItems - записывает каталог продуктов
- getItems - возвращяет коталог продуктов
- getProduct - возвращает продукт по id

class BasketModel - содержит список товаров которые добавлены в корзину и их кол-во. Методы:
- addProduct - добавление товара;
- removeProduct - убрать товар;
- resetAllProduct - очистить от всех товаров;
- getPrice - стоимость всех товаров в корзине.

class BuyerModel - содержит данные покупателя. Методы:
- set payment - записать способ оплаты ;
- set adress - записать адрес;
- set phone - записать телефон;
- set email - записать почтовый адрес;
- get payment - записать способ оплаты ;
- get adress - записать адрес;
- get phone - записать телефон;
- get email - записать почтовый адрес;
- validForm - валидация форм;
- resetBuyerInfo - сброс данных пользователя.

## Компоненты представления

class BasketView - отображение корзины;

class CardView - отображение одной карточки и отслеживание добавление товара в корзину;

class CatalogView - отображение каталога карточек на главной странице, отслеживает клик по карточке;

class PageView - отображение кол-ва товаров в корзине и блокировка прокрутки при открытии модального окна;

class ContactsForm - форма почты и телефона;

class PayForm - форма со способом оплаты и адрес доставки;

## Презентер

class Presenter - отвечает за связь между моделямью данных и компонентами представления. Методы:
- renderBasket - отрисовка корзины;
- renderCatalog - отрисовка каталога карточек;
- openCard - открыть карточку;
- lockedScroll - блокировка прокрутки страницы;
- unlockScroll - снятие блокировки прокрутки страницы;
- openAnswer - открыть модальное окно успешного заказа;
- openPayForm - открыть модальное окно оплаты;
- updatePayForm - обновляет данные оплаты
- openContactsForm - открыть модальное окно данных пользователя; 
- updateContactsForm - обновляет данные пользователя
- closeModal - закрыть модальное окно;

## Сервисный класс WebLarekApi 

class WebLarekApi extends Api - класс для получения данных с сервера и отправки данных. Методы:
- getItemsList - получения обьекта с товарами с сервера
- getProduct - получения оъекта товара по id
- postOrder - отправка списка покупок на сервер
