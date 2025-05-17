import { Card } from "./Card.js";
import { FormValidator } from "./FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const userInfo = new UserInfo({
  userNameSelector: '.profile__name',
  userJobSelector: '.profile__job'
});

const profilePopupInstance = new PopupWithForm(
  '#edit-profile-popup',
  (formData) => {
    userInfo.setUserInfo({
      name: formData.name,
      job: formData.about
    });
    profilePopupInstance.close();
  }
);

const addCardPopupInstance = new PopupWithForm(
  '#add-element-popup',
  (formData) => {
    const newCard = new Card(
      { name: formData.title, link: formData.link },
      '#card-template',
      (src, alt) => imagePopupInstance.open({src, alt})
    ).generateCard();
    cardSection.addItem(newCard);
    addCardPopupInstance.close();
  }
);

const imagePopupInstance = new PopupWithImage('#image-popup');

const cardSection = new Section(
  {
    items: [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg"
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg"
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg"
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg"
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg"
  }
],
renderer: (cardData) => {
  const card = new Card(
    cardData,
    '#card-template',
    (src, alt) => imagePopupInstance.open({ src, alt })
  ).generateCard();
  cardSection.addItem(card);
}
},
'.elements'
);

const profileFormValidator = new FormValidator(validationConfig, document.getElementById('profile-form'));
const cardFormValidator = new FormValidator(validationConfig, document.getElementById('card-form'));

const openProfilePopup = () => {
  const currentUserInfo = userInfo.getUserInfo();
  document.querySelector('input[name="name"]').value = currentUserInfo.name;
  document.querySelector('input[name="about"]').value = currentUserInfo.job;
  profileFormValidator.resetValidation();
  profilePopupInstance.open();
};

const openAddCardPopup = () => {
  addCardPopupInstance.open();
  cardFormValidator.resetValidation();
};

document.querySelector('.profile__edit').addEventListener('click', openProfilePopup);
document.querySelector('.profile__add-button').addEventListener('click', openAddCardPopup);

profilePopupInstance.setEventListeners();
addCardPopupInstance.setEventListeners();
imagePopupInstance.setEventListeners();

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();

cardSection.renderItems();
