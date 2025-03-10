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

## Типы данных и интерфейсы

type TResponseProductList = ApiListResponse<IProduct>; - каталог товаров полученных с сервера и общее кол-во товаров

type TResponseProductItem = IProduct | { error: 'NotFound' }; 

type TResponseOrder = { id: string; total: number } | { error: string }; 

type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил'; - категории товаров

type TPaymentMethod = 'card' | 'cash'; - тип оплаты

interface IProduct {

	id: string; - id товара;

    category: string; - категория товара;

    title: string; - название товара;

    image: string; - картинка товара;

	description: string; - описание товара;

	price: number; - стоимость товара;
    
}

interface IFormState {
    valid: boolean;
    errors: string[];
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