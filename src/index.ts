import './scss/styles.scss';
import { Api } from './components/base/base/api';
import {API_URL} from './utils/constants';

const api = new Api(API_URL);
api.get('/product/').then((result) => console.log(result));


/*const arrId = ['854cef69-976d-4c2a-a18c-2aa45046c390', 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'];
const totalSum: number = 1450 + 750;

const newObgobg = {
    "payment": "online",
    "email": "test@test.ru",
    "phone": "+71234567890",
    "address": "Spb Vosstania 1",
    "total": totalSum,
    "items": arrId
};

api.post('order', newObgobg).then((result) => 
    console.log(result));*/