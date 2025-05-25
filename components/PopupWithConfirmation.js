import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleformSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleformSubmit;
    this._form = this._popup.querySelector('.popup__form');
    this._submitButton = this._popup.querySelector('.popup__save-button');
    this._submitButtonText = this._submitButton.textContent;
    this._cardId = null;
    this._cardElement = null;
  }

    setLoadingState(isLoading, loadingText = 'Eliminando...') {
    if (isLoading) {
      this._submitButton.textContent = loadingText;
      this._submitButton.disabled = true;
      this._submitButton.classList.add('popup__save-button_loading');
    } else {
      this._submitButton.textContent = this._submitButtonText;
      this._submitButton.disabled = false;
      this._submitButton.classList.remove('popup__save-button_loading');
    }
  }

    setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._cardId, this._cardElement);
    });
  }

  open(cardId, cardElement) {
    super.open();
    this._cardId = cardId;
    this._cardElement = cardElement;
  }
}