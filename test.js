import { ready, get } from 'uc-dom'
import Input from './index'

ready(() => {
  const elDisplay = get('#display')

  const input = new Input({
    onChange: val => {
      console.log('val', val);
      if (val === 'error') {
        input.error('Oops!');
      }
    }
  }).appendTo(elDisplay);

  // setTimeout(() => input.remove(), 5000);
});
