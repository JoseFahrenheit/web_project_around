export class Card {
  constructor(data, templateSelector, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    return document.querySelector(this._templateSelector).content.querySelector('.element').cloneNode(true);
  }

  _setEventListeners() {
    this._element.querySelector('.element__image').addEventListener('click', () => {
      this._handleCardClick(this._link, this._name);
    });

    this._element.querySelector('.element__vector').addEventListener('click', (evt) => {
      evt.target.classList.toggle('element__vector_active');
    });

    this._element.querySelector('.element__delete').addEventListener('click', () => {
      this._element.remove();
    });
  }

  generateCard() {
    this._element = this._getTemplate();
    const cardImage = this._element.querySelector('.element__image');

    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._element.querySelector('.element__paragraph').textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}