import { Popup } from "./Popup.js";

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._imageElement = this._popup.querySelector('.popup__image');
    this._captionImage = this._popup.querySelector('.popup__caption');
  }

  open({ src, alt}) {
    this._imageElement.src = src;
    this._imageElement.alt = alt;
    this._captionImage.textContent = alt;
    super.open();
  }
}