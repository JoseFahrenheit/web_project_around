export class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items || [];
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  addItem(element, prepend = true) {
    if (prepend) {
      this._container.prepend(element);
    } else {
      this._container.append(element);
    }
  }

  renderItems(items = this._initialItems) {
    items.forEach(item => this._renderer(item));
  }
}