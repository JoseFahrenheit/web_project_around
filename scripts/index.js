document.addEventListener("DOMContentLoaded", function() {
  const inputs = document.querySelectorAll("inputs[required], input[minlength]");
  inputs.forEach((input) => {
    let message = "Por favor, rellene este campo";
    if (input.type === "url") {
      message = "Por favor, introduce una direccion web";
    }

    input.oninvalid = function (e) {
      e.target.setCustomValidity("");
      if (!e.target.validity.valid) {
        if (e.target.validity.tooShort) {
          const min = e.target.getAttribute("minlength");
          e.target.setCustomValidity(`Mínimo ${min} caracteres`);
        } else if (e.target.validity.typeMismatch) {
          e.target.setCustomValidity("Introduce una dirección web válida");
        } else {
          e.target.setCustomValidity(message);
        }
      }
    };

    input.oninput = function (e) {
      e.target.setCustomValidity("");
    };
  });
});

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

function openPopup(popup) {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', closePopupByEsc);
}

function closePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', closePopupByEsc);
}

function closePopupByOverlay(evt) {
  if (evt.target.classList.contains('popup_opened')) {
    closePopup(evt.target);
  }
}

function closePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

function openProfilePopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
  clearValidation(profileForm, validationConfig);
  openPopup(profilePopup);
}

function openAddCardPopup() {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openPopup(addCardPopup);
}

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = alt;
  openPopup(imagePopup);
}

function createCard(cardData) {
  const template = document.getElementById('card-template');
  const cardElement = template.content.cloneNode(true).querySelector('.element');

  const cardImage = cardElement.querySelector('.element__image');
  const cardTitle = cardElement.querySelector('.element__paragraph');
  const likeButton = cardElement.querySelector('.element__vector');
  const deleteButton = cardElement.querySelector('.element__delete');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('element__vector_active');
  });

  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  return cardElement;
}

function renderCards() {
  initialCards.forEach(cardData => {
    const card = createCard(cardData);
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

  const newCard = createCard(newCardData);
  cardsContainer.prepend(newCard);
  closePopup(addCardPopup);
}

function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
}

function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
}

function clearValidation(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  toggleButtonState(inputList, buttonElement, settings);
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

enableValidation(validationConfig);
renderCards();
