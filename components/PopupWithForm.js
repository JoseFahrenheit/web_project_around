import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector)
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector('.popup__form');
    this._submitButton = this._form.querySelector('.popup__save-button');
    this._submitButtonText = this._submitButton.textContent;
    this._inputs = this._form.querySelectorAll('.popup__input');
  }

  _getInputValues() {
    const values = {};
    this._inputs.forEach(input => {
      values[input.name] = input.value;
    });
    return values;
  }

  setLoadingState(isLoading, loadingText = 'Guardando...') {
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
      this._handleFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}