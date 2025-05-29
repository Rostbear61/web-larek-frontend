export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;



export const settings = {
    emailValidateMessage : 'Введите корректный email',
    adressValidateMessage : 'Введите адрес доставки',
    phoneValidateMessage : 'Введите корректный номер телефона',
    payValidateMessage : 'Выберите способ оплаты'
};

export const categoryMap = {
  'другое': 'other',
  'софт-скил': 'soft',
  'дополнительное': 'additional',
  'кнопка': 'button',
  'хард-скил': 'hard',
} as const;
