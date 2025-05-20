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

type TSendProduct = ISendOrder | { error: string }

type TResponseOrder = TAnswerOrder | { error: string }; 

type TPaymentMethod = 'card' | 'cash'; - тип оплаты

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

interface IPayForm{
-	payment: TPaymentMethod,
-	address: string,
}

interface ICatalogModel {
-	items: IProduct[];
-	findProductById(id: string): IProduct;
}

interface IBasket {
-	items: Set<string>;
}

interface IBasketModel {
-	addItem(id: string): void;
-	removeItem(id: string): void;
-    checkItem(id: string): boolean;
-    getItemsCount(): number;
-    clearAll(): void;
-    getItems() : string[];
}

interface IOrder extends IContacts, IPayment {
-	total: number;
-	items: string[];
}

export interface IClientModel {
    payment: TPaymentMethod,
	address: string,
    phone: string;
	email: string;
}

## Базовый код
- class Api:
--	readonly baseUrl: string;
--	protected options: RequestInit;
--	constructor(baseUrl: string, options: RequestInit = {}) ;
--	protected handleResponse(response: Response): Promise<object> ;
--	get(uri: string) ;
--	post(uri: string, data: object, method: ApiPostMethods = 'POST').

- abstract class Component<T>:
--	protected constructor(protected readonly container: HTMLElement);
--	toggleClass(element: HTMLElement, className: string, force?: boolean);
--	protected setText(element: HTMLElement, value: unknown);
--	setDisabled(element: HTMLElement, state: boolean) ;
--	protected setHidden(element: HTMLElement) ;
--	protected setVisible(element: HTMLElement) ;
--	protected setImage(element: HTMLImageElement, src: string, alt?: string) ;
--	render(data?: Partial<T>): HTMLElement .

- class EventEmitter implements IEvents:
--	_events: Map<EventName, Set<Subscriber>>;
--	on<T extends object>(eventName: EventName, callback: (event: T) => void) ;
--	off(eventName: EventName, callback: Subscriber) ;
--	emit<T extends object>(eventName: string, data?: T) ;
--	onAll(callback: (event: EmitterEvent) => void) ;
--	offAll() ;
--	trigger<T extends object>(eventName: string, context?: Partial<T>) .

- abstract class Model<T>:
--	constructor(data: Partial<T>, protected events: IEvents);
--	emitChanges(event: string, payload?: object) .

- class Modal extends Component<IModalData>:
--    protected _closeButton: HTMLButtonElement;
--   protected _content: HTMLElement;
--    set content(value: HTMLElement);
--    open();
--    close();
--    render(data: IModalData) : HTMLElement.

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

## Компоненты представления

Класс Modal реализует функциональность модального окна для отображения произвольного контента и управления его открытием и закрытием. Методы:
- openModal - Открывает модальное окно, добавляет обратчика событий на закрытие окна нажатием на крестик или "Esc" на клавиатуре. вставляет переданный в метод элемент.
- closeModal - скрывает модальное окно.

Класс BasketView представляет собой компонент пользовательского интерфейса для отображения и управления корзиной покупок в приложении. Он реализует интерфейс IBasketView и наследует от базового компонента Component<IBasket>. Методы:
update - обновление данных из модели данных
render - отрисовывает компонент внутри контейнера.

Класс cardModalView представляет собой компонент пользовательского интерфейса для отображения подробного просмотра карточки продукта в виде модального окна или отдельной карточки. Он предназначен для отображения информации о товаре и обработки действий пользователя, таких как добавление или удаление товара из корзины. Методы:
render - отрисовывает компонент внутри контейнера

Класс CatalogView представляет собой компонент пользовательского интерфейса для отображения каталога товаров на странице. Он отвечает за отображение списка продуктов, создаваемых на основе данных, и за взаимодействие с пользователем через события. Метод:
- showProducts - получает массив с обьектами карточек, для каждого создает экземпляр класса ProductCard, вызывает метод рендер данного класса для получения DOM-элемента карточки и выводит эту карточку на страницу.

Класс ProductCard представляет собой компонент карточки товара, предназначенный для отображения информации о продукте и обработки взаимодействий пользователя. Методы:
- formatPrice - форматирует цену товара
- getTemplateData - Возвращает объект с данными, подготовленными для шаблона
- render - Находит шаблон, создает его копию, заполняет содержимое карточки и добавляет слушателя на нажатие по карточке, возвращает элемент карточки.

Класс ContactsForm представляет собой компонент формы для ввода контактных данных (email и телефон). Он расширяет базовый класс Component и предназначен для отображения формы, валидации введённых данных и отправки событий при её использовании. Методы:
- validate - вызывает внутренний метод валидации;
- render - создает DOM-структуру формы на основе шаблона, если переданы данные заполняет ими св-ва компонента, инициализирует ссылки на элементы формы, устанавливает обработчики событий, возвращает созданный DOM-элемент контейнера с формой.
- private initializeElements - Находит внутри контейнера элементы формы: саму форму, поля email и телефон, кнопку отправки, элемент для отображения ошибок, заполняет поля email и телефон значениями из свойств компонента, если они есть, Деактивирует кнопку отправки по умолчанию.
- private attachEventListeners - добавляет слушателей на поля ввода данных и отправка формы. Обрабатывает событие отправки формы.
- private validForm - Проверяет корректность email и телефона с помощью методов validateEmail() и validatePhone(). В зависимости от результатов отображает ошибку ввода данных и блокирует кнопку перехода.
- private validateEmail - проверяет формат email по регулярному выражению.
- private validatePhone - проверяет формат номера телефона (должен начинаться с '+7' и содержать 10 цифр)

Класс PageView представляет собой компонент пользовательского интерфейса, отвечающий за отображение и управление элементами страницы, связанными с корзиной и состоянием прокрутки страницы. Методы:
- set basketCount - установить счетчик товарок в корзине;
- set scrollState - установить или убрать блокировку прокрутки страницы.

Класс PayForm представляет собой компонент формы оплаты, предназначенный для сбора данных пользователя при оформлении заказа. Он управляет отображением формы, обработкой пользовательских взаимодействий и валидацией данных. Методы: 
- validate - вызывает внутренний метод валидации;
- render - создает DOM-структуру формы на основе шаблона, если переданы данные заполняет ими св-ва компонента, клонирует содержимое шаблона и вставляе в него новый контейнер, инициализирует элементы и назначает обработчики событий, возвращает созданный DOM-элемент формы
- private initializeElements - находит и сохраняет ссылки на важные элементы формы (форма, кнопки, поле адреса, кнопка отправки, область ошибок). Также устанавливает начальные состояния (например, активность кнопки оплаты).
- private attachEventListeners - добавляет слушателей событий на кнопки выбора способа оплаты, на ввод данных в адрес и оправку формы.
- private setPaymentMethod - записывает выбранный метод оплаты и отображение его на странице
- private validForm - производит валидация введенных данных

Класс OrderSuccess предназначен для отображения результата оформления заказа — либо успешного завершения, либо ошибки. Метод:
- render - принимает объект который либо содержит информацию об успешном заказе, либо ошибку.Если заказ прошел успешно отображает страницу из шаблона с указанием потраченной суммы из ответа сервера.


## Презентер

Класс Presenter реализует центральную логику взаимодействия между моделями, видами и интерфейсом пользователя в приложении. Он служит связующим звеном, координируя работу различных компонентов и обеспечивая реакцию на пользовательские действия. Методы:
- updateCatalog - обновляет список товаров в модели каталога.
- showCard - показывает список товаров.
- openCardModal - создает представление карточки товара и открывает его в модальном окне. Проверяет наличие товара в корзине.
- pageScrollLock -  блокируют прокрутку страницы при открытии модальных окон.
- pageScrollUnlock - разблокируют прокрутку страницы закрытии модальных окон.
- basketAdd - добавляют товар из корзины
- basketRemove - удаляют товар из корзины
- openBasket - отображает содержимое корзины в модальном окне.
- UpdateBasketCount - обновление счетчика товаров в корзине.
- openPayForm - открыть окно с формой оплаты
- updatePayInfo - записать данные введенные в форме в модель
- openContactForm - открыть окно с формой контактов
- updateContactsInfo - записать данные введенные в форме в модель
- sendOrder - собирает данные о заказе, фильтрует товары без цены, формирует объект заказа.
- openSuccess - показывает экран успешного заказа
- closeModal - закрывает модальное окно и разблокирует прокрутку страницы.

## Сервисный класс WebLarekApi 

class WebLarekApi extends Api - класс для получения данных с сервера и отправки данных. Методы:
- getItemsList - получения объекта с товарами с сервера
- getProduct - получения объекта товара по id
- postOrder - отправка списка покупок на сервер