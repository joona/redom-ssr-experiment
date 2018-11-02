window.$refs = {};

import { el, mount, unmount, text } from 'redom';
import { App, FooList } from './components.js';

const ref = (id) => {
  return document.getElementById(id);
}

const state = (id) => {
  return window.$state[id];
}

console.log('look ma, im running in a browser');
console.log('state:', window.$state);

const replace = (container, el, component) => {
  console.log('replacing:', el, 'with', component, 'in', container);
  mount(container, component, el);
  unmount(container, el);
}

const app = App.from('App__1');
console.log('mounting', app);

const fooList = FooList.from('FooList__1');
fooList.update();
replace(document.body, ref('FooList__1'), fooList);


setTimeout(() => {
  replace(document.body, ref('App__1'), app);
  app.update();

  fooList.update([
    { title: 'Beer' },
    { title: 'Coffee' },
    { title: 'Peanuts' }
  ]);
  
  app.update({ title: 'Hello from RE:DOM!' });
}, 1000);

