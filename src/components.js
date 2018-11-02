import { el, mount, text, list } from 'redom';

export class RehydrateComponent {
  constructor() {
  
  }

  onmount() {
    const refs = $refs[this.constructor.name] = $refs[this.constructor.name] || [];
    console.log('refs:', refs);
    const refIdx = refs.push(this);
    const ref = `${this.constructor.name}__${refIdx}`
    console.log('this.el:', this.el);
    const element = this.el.el || this.el;
    element.setAttribute('data-ref', `${this.constructor.name}__${refIdx}`);
    element.setAttribute('data-component', this.constructor.name);
    this.ref = element.id = ref;
    this.update();
  }

  retrieveState() {
    return $state[this.ref] || {};
  }

  saveState(data) {
    this.data = data;
    if(this.ref) $state[this.ref] = this.data;
  }

  static from(ref) {
    const component = new this();
    component.ref = ref;
    return component;
  }
}

class FooListItem {
  constructor() {
    this.el = el('.foo', this.text = text());
  }

  update(data) {
    this.text.nodeValue = data.title;
  }
}

export class FooList extends RehydrateComponent {
  constructor() {
    super();
    this.el = el('.component.list-component', [
      el('h2', 'Shopping list, u know'),
      this.list = list('.list', FooListItem, 'title'),
      this.input = el('input.foo', {
        type: 'text',
        placeholder: 'Write more...'
      })
    ]);

    this.input.onchange = e => {
      this.onChange();
    }
  }

  update(data) {
    data = data || this.data || this.retrieveState();
    this.saveState(data);

    console.log('foolist', data);
    this.list.update(data);
  }

  onChange() {
    const val = this.input.value;

    this.update([...this.data, { title: val }]);
    this.input.value = '';
  }
}

export class App extends RehydrateComponent {
  constructor() {
    super();
    this.el = el('.component.app-component', [
      this.header = el('h1', this.title = text()),
      el('h5', [
        text('Update Counter: '), 
        this.counter = text()
      ])
    ]);

    this.header.onclick = () => {
      this.update();
    }
  }

  update(data) {
    data = data || this.data || this.retrieveState();
    data.updates = data.updates+1 || (this.data ? this.data.updates+1 : 0) || 0;
    this.saveState(data);

    this.counter.nodeValue = data.updates || 0;
    this.title.nodeValue = data.title;
  }
}
