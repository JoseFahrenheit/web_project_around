import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleformSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleformSubmit;
    this._form = this._popup.querySelector('.popup__form');
    this._submitButtom = this._popup.querySelector('.popup__save-button');
    this._submitButtonText = this._submitButtom.textContent;
  }

  open(cardId, cardElement) {
    super.open();
    this._cardId = cardId;
    this._cardElement = cardElement;
  }

  setLoadingState(isLoading, loadingText = 'Eliminando...') {
    if (isLoading) {
      this._submitButtom.textContent = loadingText;
    } else {
      this._submitButtom.textContent = this._submitButtonText;
    }
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._cardId, this._cardElement);
    });
  }
}