const editButton = document.querySelector('.profile__edit');
const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.popup__close');

const nameInput = document.querySelector('input[name="name"]');
const aboutInput = document.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');

const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.getElementById('add-element-popup');
const closeAddCardButton = addCardPopup.querySelector('.popup__close');
const addCardForm = addCardPopup.querySelector('.popup__form');
const titleInput = document.querySelector('input[name="title"]');
const linkInput = document.querySelector('input[name="link"]');

const imagePopup = document.getElementById('image-popup');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeImagePopup = imagePopup.querySelector('.popup__close');

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

const cardsContainer = document.querySelector('.elements');

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = alt;
  imagePopup.classList.add('popup_opened');
}

function closeImagePopupHandler() {
  imagePopup.classList.remove('popup_opened');
}

function createCard(cardData) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('element');

  cardElement.innerHTML = `
  <img src="${cardData.link}" alt="${cardData.name}" class="element__image">
  <button type="button" class="element__delete"></button>
  <img src="./images/element_Rectangle.png" alt="Rectangulo" class="element__rectangle">
  <div class="element__footer">
  <p class="element__paragraph">${cardData.name}</p>
  <img src="./images/element_Vector.svg" alt="Like" class="element__vector">
  </div>
  `;

  const cardImage = cardElement.querySelector('.element__image');
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  const likeButton = cardElement.querySelector('.element__vector');
  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('element__vector_active');
    likeButton.src = likeButton.classList.contains('element__vector_active')
    ? './images/Union.png'
    : './images/element_vector.svg';
  });

  const deleteButton = cardElement.querySelector('.element__delete');
  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  return cardElement;
}

closeImagePopup.addEventListener('click', closeImagePopupHandler);

imagePopup.addEventListener('click', (evt) => {
  if(evt.target === imagePopup) {
    closeImagePopupHandler();
  }
});

function renderCards() {
  initialCards.forEach(cardData => {
    const card = createCard(cardData);
    cardsContainer.appendChild(card);
  });
}

renderCards();

function openPopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;

  popup.classList.add('popup_opened');
}

function closePopup() {
  popup.classList.remove('popup_opened');
}

editButton.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);

const formElement = document.querySelector('.popup__form');

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const newName = nameInput.value;
  const newAbout = aboutInput.value;

  profileName.textContent = newName;
  profileJob.textContent = newAbout;

  closePopup();
}

const saveButton = document.querySelector('.popup__save-button');

function toggleButtonState() {
  if (nameInput.value.trim() && aboutInput.value.trim()) {
    saveButton.disabled = false;
  } else {
    saveButton.disabled = true;
  }
}

nameInput.addEventListener('input', toggleButtonState);
aboutInput.addEventListener('input', toggleButtonState);

function openPopup() {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileJob.textContent;
  toggleButtonState();
  popup.classList.add('popup_opened');
}

formElement.addEventListener('submit', handleProfileFormSubmit);

function openAddCardPopup() {
  addCardPopup.classList.add('popup_opened');
}

function closeAddCardPopup() {
  addCardPopup.classList.remove('popup_opened');
}

addButton.addEventListener('click', openAddCardPopup);
closeAddCardButton.addEventListener('click', closeAddCardPopup);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: titleInput.value,
    link: linkInput.value
  };

  const newCard = createCard(newCardData);
  cardsContainer.prepend(newCard);

  addCardForm.reset();
  closeAddCardPopup();
}

addCardForm.addEventListener('submit', handleAddCardSubmit);

const addCardSaveButton = addCardPopup.querySelector('.popup__save-button');

function toggleAddCardButtonState() {
  if (titleInput.value.trim() && linkInput.value.trim()) {
    addCardSaveButton.disabled = false;
  } else {
    addCardSaveButton.disabled = true;
  }
}

titleInput.addEventListener('input', toggleAddCardButtonState);
linkInput.addEventListener('input', toggleAddCardButtonState);
