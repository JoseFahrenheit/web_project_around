export class Card {
  constructor(data, templateSelector, handleCardClick, handleLikeClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._likes = data.likes || [];
    this._isLiked = data.isLiked;
    this._userId = data.userId;
    this._ownerId = data.ownerId;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content
      .querySelector('.element')
      .cloneNode(true);
  }

  _setEventListeners() {
    this._element.querySelector('.element__image').addEventListener('click', () => {
      this._handleCardClick(this._link, this._name);
    });

    this._likeButton.addEventListener('click', () => {
      this._handleLikeClick(this._id, !this._isLiked)
        .then((updatedData) => {
          this._likes = updatedData.likes;
          this._isLiked = updatedData.isLiked;
          this._updateLikeState();
        })
        .catch((err) => {
          console.error('Error al actualizar like:', err);
        });
    });

    this._deleteButton = this._element.querySelector('.element__delete');
    const isOwner = this._ownerId === this._userId;
    if (isOwner) {
      this._deleteButton.style.display = 'block';
      this._deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        this._handleDeleteClick(this._id, this._element);
      });
    } else {
      this._deleteButton.style.display = 'none';
    }
  }

  _updateLikeState() {
    if (this._isLiked) {
      this._likeButton.classList.add('element__vector_active');
    } else {
      this._likeButton.classList.remove('element__vector_active');
    }
    if (this._likeCountElement) {
      this._likeCountElement.textContent = this._likes.length;
    }
  }

  generateCard() {
    this._element = this._getTemplate();
    const cardImage = this._element.querySelector('.element__image');
    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._element.querySelector('.element__paragraph').textContent = this._name;
    this._likeButton = this._element.querySelector('.element__vector');
    this._likeCountElement = this._element.querySelector('.element__like-counter');
    this._updateLikeState();
    this._setEventListeners();
    return this._element;
  }
}
