export class Card {
  constructor(data, templateSelector, handleCardClick, handleLikeClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._isLiked = data.isLiked || false;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
    this._likeButton = null;
    this._deleteButton = null;
  }

  _getTemplate() {
    return document.querySelector(this._templateSelector).content.querySelector('.element').cloneNode(true);
  }

  _setEventListeners() {
    this._element.querySelector('.element__image').addEventListener('click', () => {
      this._handleCardClick(this._link, this._name);
    });

    this._likeButton = this._element.querySelector('.element__vector');
    this._likeButton.addEventListener('click', () => {
      this._handleLikeClick(this._id, !this._isLiked)
      .then(updatedCard => {
        this._isLiked = updatedCard.isLiked;
        this._updateLikeState();
      });
    });

    this._deleteButton = this._element.querySelector('.element__delete');
    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._id, this._element);
    });
  }

  _updateLikeState() {
    if (this._isLiked) {
      this._likeButton.classList.add('element__vector_active');
    } else {
      this._likeButton.classList.remove('element__vector_active');
    }
  }

  generateCard() {
    this._element = this._getTemplate();
    const cardImage = this._element.querySelector('.element__image');

    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._element.querySelector('.element__paragraph').textContent = this._name;

    this._likeButton = this._element.querySelector('.element__vector');
    this._updateLikeState();

    this._setEventListeners();

    return this._element;
  }
}