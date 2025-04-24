const editButton = document.querySelector('.profile__edit');
const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.popup__close');

const nameInput = document.querySelector('input[name="name"]');
const aboutInput = document.querySelector('input[name="about"]');
const profileName = document.querySelector('.profile__name');
const profileJob = document.querySelector('.profile__job');

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