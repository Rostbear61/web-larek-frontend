import './scss/styles.scss';
import { Api } from './components/base/api';

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek/');
api.get('product/').then((result) => console.log(result));
api.get('product/c101ab44-ed99-4a54-990d-47aa2bb4e7d9').then((result) => console.log(result));


