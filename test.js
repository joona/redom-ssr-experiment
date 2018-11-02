const domino = require('domino');
const util = require('util');
const fs = require('fs');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const template = `
<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>RE:DOM SSR</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/redom/3.14.2/redom.es.js"></script>
    <style type="text/css">
      body {
        background-color: #263238;
        color: white;
        font-family: monospace;
        font-size: 1.4em;
      }

      h1, h2, h3 {
        color: lightcoral;
      }

      .component {
        border: 0.25em solid rgba(218, 247, 166, 0.8);
        padding: 1em;
        margin-bottom: 2em;
      }

      .list-component .foo {
        padding: 1em;
        margin-bottom: 0.5em;
        background-color: lightcoral;
        color: #263238;
      }

      input {
        background-color: #263238;
        color: white;
        font-family: monospace;
        border: none;
        font-size: 1.4em;
      }

      input:focus {
        outline: none;
      }

      input::placeholder {
        color: white;
      }
    </style>
  </head>
  <body class="">
    <h1>RE:DOM SSR and rehydration experiment</h1>
  </body>
</html>
`;

global.document = domino.createDocument(template, true);
global.SVGElement = function() {};
global.$refs = {};
global.$ids = {};
global.$state = {};

import { el, mount } from 'redom';
import { App, FooList } from './src/components';

const render = () => {
  const data = el('script', {
    type: 'application/javascript'
  });
  mount(document.head, data, document.head.childNodes[0]);

  const app = new App();
  app.update({ title: 'Hello from Server Side' });

  const appTwo = new App();
  appTwo.update({ title: 'Another component' });

  mount(document.body, app);
  mount(document.body, appTwo);
  document.body.classList.add('foo');

  const fooList = new FooList();
  fooList.update([
    { title: 'Coffee'},
    { title: 'Milk'},
    { title: 'Beer'}
  ]);

  mount(document.body, fooList);

  mount(document.head, el('script', {
    src: './app.js',
    type: 'module'
  }));

  data.textContent = `
  window['$state'] = ${JSON.stringify(global.$state)};
  console.log('state loaded');
  `;

  console.log(document.outerHTML);
  return document.outerHTML;
}


const main = async () => {
  const contents = render();

  await writeFile('dist/index.html', contents);
  //const js = await readFile('src/app.js');
  //await writeFile('src/app.js', js.toString());
};

main()
  .then(_ => {
    console.log('ok');
  });
