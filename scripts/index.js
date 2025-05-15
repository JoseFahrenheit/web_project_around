import { Card } from "./Card.js";
import { FormValidator } from "./FormValidator.js";
import { openPopup, closePopup, closePopupByOverlay } from "./utils.js";

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const editButton = document.querySelector('.profile__edit');
const profilePopup = document.getElementById('edit-profile-popup');
const closeProfileButton = profilePopup.querySelector('.popup__close');
const profileForm = document.getElementById('profile-form');
const nameInput = profileForm.querySelector('input[name="name"]');
const aboutInput = profileForm.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');

const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.getElementById('add-element-popup');
const closeAddCardButton = addCardPopup.querySelector('.popup__close');
const addCardForm = document.getElementById('card-form');
const titleInput = addCardForm.querySelector('input[name="title"]');
const linkInput = addCardForm.querySelector('input[name="link"]');

const imagePopup = document.getElementById('image-popup');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImagePopup = imagePopup.querySelector('.popup__close');

const cardsContainer = document.querySelector('.elements');

const initialCards = [
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
];

const profileFormValidator = new FormValidator(validationConfig, profileForm);
const cardFormValidator = new FormValidator(validationConfig, addCardForm);

function openProfilePopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
  profileFormValidator.resetValidation();
  openPopup(profilePopup);
}

function openAddCardPopup() {
  addCardForm.reset();
  cardFormValidator.resetValidation();
  openPopup(addCardPopup);
}

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = alt;
  openPopup(imagePopup);
}

function renderCards() {
  if (!cardsContainer) {
    console.error('Error: No se encontró el contenedor de tarjetas (.elements)');
    return;
  }

  initialCards.forEach(cardData => {
    const card = new Card(cardData, '#card-template', openImagePopup).generateCard();
    cardsContainer.appendChild(card);
  });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = aboutInput.value;
  closePopup(profilePopup);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: titleInput.value,
    link: linkInput.value
  };

  const newCard = new Card(newCardData, '#card-template', openImagePopup).generateCard();
  cardsContainer.prepend(newCard);
  closePopup(addCardPopup);
}

editButton.addEventListener('click', openProfilePopup);
closeProfileButton.addEventListener('click', () => closePopup(profilePopup));
profilePopup.addEventListener('click', closePopupByOverlay);

addButton.addEventListener('click', openAddCardPopup);
closeAddCardButton.addEventListener('click', () => closePopup(addCardPopup));
addCardPopup.addEventListener('click', closePopupByOverlay);

closeImagePopup.addEventListener('click', () => closePopup(imagePopup));
imagePopup.addEventListener('click', closePopupByOverlay);

profileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardSubmit);

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();
renderCards();
