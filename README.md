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
## Описание проекта
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

type TSendProduct = ISendOrder | { error: string }

type TResponseOrder = TAnswerOrder | { error: string }; 

type TPaymentMethod = 'card' | 'cash'; - тип оплаты

type CategoryKey = keyof typeof categoryMap;

type EventName = string | RegExp;

type TAnswerOrder = { id: string; total: number };

interface IEvents {
 -   on<T extends object>(event: EventName, callback: (data: T) => void): void;
 -   emit<T extends object>(event: string, data?: T): void;
 -   trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

interface IEventEmiter {
-	emit: (event: string, data: unknown) => void;
}

export interface IServerAnswer {
-    items : IProduct[],
-    total : number
}

interface IProduct {
-	id: string; - id товара;
-    category: string; - категория товара;
-    title: string; - название товара;
-    image: string; - картинка товара;
-	description: string; - описание товара;
-	price: number | null; - стоимость товара;
}

interface ISendOrder { - интерфейс объекта для отправки заказа на сервер
-	"payment": string,
-    "email": string,
-    "phone": string,
-    "address": string,
-    "total": number,
-    "items": string[]
}

interface IContacts{
-	phone: string;
-	email: string;
}

interface IPayForm{
-	payment: TPaymentMethod,
-	address: string,
}

interface ICatalogModel {
-	items: IProduct[];
-	findProductById(id: string): IProduct;
}

interface IBasketModel {
-	addItem(id: string): void;
-	removeItem(id: string): void;
-    checkItem(id: string): boolean;
-    getItemsCount(): number;
-    clearAll(): void;
-    getItems() : string[];
}
export interface IClientModel {
    payment: TPaymentMethod,
	address: string,
    phone: string;
	email: string;
}

## Базовый код
class Api:
-	readonly baseUrl: string;
-	protected options: RequestInit;
-	constructor(baseUrl: string, options: RequestInit = {}) ;
-	protected handleResponse(response: Response): Promise<object> ;
-	get(uri: string) ;
-	post(uri: string, data: object, method: ApiPostMethods = 'POST')


abstract class Component<T>:
-	protected constructor(protected readonly container: HTMLElement);
-	toggleClass(element: HTMLElement, className: string, force?: boolean);
-	protected setText(element: HTMLElement, value: unknown);
-	setDisabled(element: HTMLElement, state: boolean) ;
-	protected setHidden(element: HTMLElement) ;
-	protected setVisible(element: HTMLElement) ;
-	protected setImage(element: HTMLImageElement, src: string, alt?: string) ;
-	render(data?: Partial<T>): HTMLElement .


class EventEmitter implements IEvents:
-	_events: Map<EventName, Set<Subscriber>>;
-	on<T extends object>(eventName: EventName, callback: (event: T) => void) ;
-	off(eventName: EventName, callback: Subscriber) ;
-	emit<T extends object>(eventName: string, data?: T) ;
-	onAll(callback: (event: EmitterEvent) => void) ;
-	offAll() ;
-	trigger<T extends object>(eventName: string, context?: Partial<T>) .

## Модель данных

Класс CatalogModel реализует модель данных для каталога товаров в приложении. Он управляет списком продуктов и обеспечивает методы для их установки, поиска и получения. Методы:
- setProduct - записывает каталог продуктов
- findProductById - возвращает продукт по id
- getAllProducts - возвращяет каталог продуктов


Класс BasketModel реализует модель данных для управления корзиной покупок в приложении. Он наследует базовые функции от Model<IBasket> и добавляет собственную логику для работы с товарами в корзине. Методы:
- addItem - добавление товара;
- removeItem - убрать товар;
- checkItem - есть ли определенный товар в корзине
- getItemCount - счетчик товаров в корзине 
- clearAll - очистить от всех товаров;
- getItems - получить массив всех товаров в корзине.
- getTotalPrice - получить стоимость всех товаров в конзине.

Класс ClientModel реализует модель данных для хранения информации о клиенте в приложении. Он управляет данными о способе оплаты, адресе, телефоне и электронной почте клиента, предоставляя методы для их получения, изменения и сброса. Методы:
- get payment - получить способ оплаты 
- get address - получить адрес
- get phone - получить телефон
- get email - получить почтовый адрес
- set payment - записать способ оплаты
- set address - записать адрес
- set phone - записать телефон
- set email - записать почтовый адрес
- clearAll - очищает данные покупателя
- getAllData - получить объект со всеми данными о пользователе
- isValidAdress - валидация данных записанных в адрес.
- isValidClient - валидация данных записанных в телефон и почтовый адрес.

## Компоненты представления

Класс Page представляет собой компонент страницы, расширяющий базовый компонент Component. Он управляет отображением счетчика товаров, каталога товаров, блокировкой страницы и взаимодействием с корзиной. Методы:
- set counter - обновляет отображение счетчика товаров.
- set catalog - заменяет содержимое галереи на переданные элементы.
- set locked - добавляет или удаляет класс блокировки прокрутки страницы.

Класс Modal представляет собой компонент модального окна, расширяющий базовый компонент Component. Он предназначен для отображения всплывающих окон с содержимым и управлением их открытием и закрытием. Методы:
- set content - заменяет содержимое модального окна на переданный элемент.
- open - Открывает модальное окно.
- close - закрывает и очищает модальное окно.
- render - вызывает базовый метод рендера, затем открывает окно и возвращает контейнер.

Класс Basket представляет собой компонент корзины покупок, расширяющий базовый компонент Component. Он предназначен для отображения списка товаров, общей стоимости и управления состоянием корзины. Методы:
- set items - обновляет содержимое списка товаров. Если список пустой, отображает сообщение "Корзина пуста"
- set selected - управляет состоянием кнопки оформления заказа — активна, если есть выбранные товары, и отключена, если корзина пуста.
- set total - обновляет отображение общей суммы заказа.

Класс Card представляет собой компонент карточки товара, расширяющий базовый компонент Component. Он предназначен для отображения информации о товаре и управления взаимодействиями с пользователем, такими как добавление или удаление товара из корзины. Методы:
- set title - устанавливает название товара.
- set description - устанавливает описание товара (если есть).
- set image - задает изображение товара.
- set category - устанавливает категорию и добавляет соответствующий класс для стилизации.
- set price -  устанавливает цену или "Бесценно", если цена не указана.
- set productInBasket - обновляет состояние товара в корзине и меняет текст кнопки на "Убрать" или "В корзину".

Класс Form — это универсальный компонент формы, расширяющий базовый компонент Component. Он предназначен для управления состоянием формы, обработкой ввода, валидацией и отправкой данных. Методы:
- set valid - включает или отключает кнопку отправки в зависимости от валидности формы.
- set errors - обновляет сообщение об ошибке.
- render - обновляет состояние формы, устанавливает значения полей и отображает ошибки.

Класс Contacts — это специализированный компонент формы, расширяющий универсальный класс Form, предназначенный для работы с контактной информацией пользователя. Методы:
- set phone - устанавливает значение поля ввода Телефона.
- set email - устанавливает значение поля ввода email.

Класс Payment — это компонент формы, расширяющий универсальный класс Form, предназначенный для выбора способа оплаты и ввода адреса доставки. Методы: 
- set payment - устанавливает выбранный способ оплаты.
- set address - устанавливает значение поля ввода Адрес.

Класс Success — это компонент, отображающий сообщение об успешном завершении заказа или операции. Он расширяет базовый компонент Component и управляет отображением информации о сумме списанных синапсов и обработкой закрытия сообщения. Метод:
- set total - устанавливает значение списанных синопсов.


## Презентер

Класс Presenter реализует центральную логику взаимодействия между моделями, видами и интерфейсом пользователя в приложении. Он служит связующим звеном, координируя работу различных компонентов и обеспечивая реакцию на пользовательские действия, благодаря событиям:

| Событие | Метод | Описание |
|---------|--------|----------|
|  | updateCatalog | обновляет список товаров в модели каталога |
| 'catalog_update' | showCard | показывает каталог товаров на главной странице |
| 'card_click', 'card_buy', 'card_remove' | openCardModal | создает представление карточки товара и открывает его в модальном окне. Проверяет наличие товара в корзине |
| 'open_modal' | pageScrollLock |  блокируют прокрутку страницы при открытии модальных окон |
| 'close_modal' | pageScrollUnlock | разблокируют прокрутку страницы закрытии модальных окон |
| 'card_buy' | basketAdd | добавляют товар из корзины |
| 'card_remove', 'basket_delete' | basketRemove | удаляют товар из корзины |
| 'open_basket', 'basket_delete' | openBasket | отображает содержимое корзины в модальном окне |
| 'basket_changed' | UpdateBasketCount | обновление счетчика товаров в корзине|
| 'basket_order' | openPayForm | открыть окно с формой оплаты |
| 'payment:change' | updatePaymentInfo | записать данные введенные в форме в модель, валидирует эти эти данные и отображает результат |
| 'order.address:change' | updateAdressInfo | записать данные введенные в форме в модель, валидирует эти эти данные и отображает результат |
| 'contacts.phone:change' | updatePhoneInfo | записать данные введенные в форме в модель, валидирует эти эти данные и отображает результат |
| 'contacts.email:change' | updateEmailInfo | записать данные введенные в форме в модель, валидирует эти эти данные и отображает результат |
| 'order:submit' | openContactForm | открыть окно с формой контактов |
| 'contacts:submit' | sendOrder | собирает данные о заказе, фильтрует товары без цены, формирует объект заказа.
| 'contacts:submit' | openSuccess | показывает экран успешного заказа, очищает содержимое модели клиента и корзины.

## Сервисный класс WebLarekApi 

class WebLarekApi extends Api - класс для получения данных с сервера и отправки данных. Методы:
- getItemsList - получения объекта с товарами с сервера
- postOrder - отправка списка покупок, общей стоимости заказа и данных клиента на сервер