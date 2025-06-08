import { Card } from "../scripts/Card.js";
import { FormValidator } from "../scripts/FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";
import { Api } from "../components/Api.js";
import { PopupWithConfirmation } from "../components/PopupWithConfirmation.js";

let currentUserId = null;

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "8c499a36-0b8d-4bbd-9f0f-54edf411ab6d",
    "Content-Type": "application/json"
  }
});

const userInfo = new UserInfo({
  userNameSelector: '.profile__name',
  userJobSelector: '.profile__job',
  userAvatarSelector: '.profile__avatar'
});

function loadAllData() {
  return Promise.all([
    api.getUserInfo(),
    api.getInitialCards()
  ])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
      avatar: userData.avatar,
      userId: currentUserId
    });

    return cardsData;
  })
  .catch(err => {
    console.error('Error al cargar datos:', err);
    currentUserId = 'default-id';
    userInfo.setUserInfo({
      name: 'Jacques Cousteau',
      job: 'Explorador',
      avatar: 'https://practicum-content.s3.us-west-1.amazonaws.com/frontend-developer/common/avatar.jpg',
      userId: currentUserId
    });
    return [];
  });
}

const createCard = (cardData) => {
  const likes = cardData.likes || [];
  const ownerId = cardData.owner && cardData.owner._id ? cardData.owner._id : currentUserId;

  const card = new Card({
    name: cardData.name,
    link: cardData.link,
    _id: cardData._id,
    likes: likes,
    isLiked: cardData.isLiked,
    userId: currentUserId,
    ownerId: ownerId
  }, '#card-template',
    (src, alt) => imagePopupInstance.open({ src, alt }),
    (cardId, isLiked) => {
      return api.toggleLike(cardId, isLiked);
    },
    (cardId, cardElement) => deleteCardPopupInstance.open(cardId, cardElement)
  );
  return card.generateCard();
}

const profilePopupInstance = new PopupWithForm('#edit-profile-popup', (formData) => {
  profilePopupInstance.setLoadingState(true, 'Guardando...');
  api.updateUserInfo({ name: formData.name, about: formData.about })
    .then(updatedData => {
      userInfo.setUserInfo({
        name: updatedData.name,
        job: updatedData.about,
        avatar: updatedData.avatar,
        userId: currentUserId
      });
      profilePopupInstance.close();
    })
    .catch(err => console.error('Error al actualizar perfil:', err))
    .finally(() => profilePopupInstance.setLoadingState(false, 'Guardar'));
});

const addCardPopupInstance = new PopupWithForm('#add-element-popup', (formData) => {
  addCardPopupInstance.setLoadingState(true, 'Creando...');
  api.addNewCard({ name: formData.title, link: formData.link })
    .then(newCard => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      addCardPopupInstance.close();
    })
    .catch(err => console.error('Error al agregar tarjeta:', err))
    .finally(() => addCardPopupInstance.setLoadingState(false, 'Crear'));
});

const deleteCardPopupInstance = new PopupWithConfirmation('#delete-card-popup', (cardId, cardElement) => {
  deleteCardPopupInstance.setLoadingState(true, 'Eliminando...');
  api.deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      deleteCardPopupInstance.close();
    })
    .catch(err => console.error('Error al eliminar tarjeta:', err))
    .finally(() => deleteCardPopupInstance.setLoadingState(false, 'Si'));
});

const avatarPopupInstance = new PopupWithForm('#edit-avatar-popup', (formData) => {
  avatarPopupInstance.setLoadingState(true, 'Guardando...');
  api.updateAvatar(formData.avatar)
    .then(updatedData => {
      userInfo.setUserInfo({
        name: updatedData.name,
        job: updatedData.about,
        avatar: updatedData.avatar,
        userId: currentUserId
      });
      avatarPopupInstance.close();
    })
    .catch(err => console.error('Error al actualizar avatar:', err))
    .finally(() => avatarPopupInstance.setLoadingState(false, 'Guardar'));
});

const imagePopupInstance = new PopupWithImage('#image-popup');

const cardSection = new Section({
  items: [],
  renderer: (cardData) => {
    const cardElement = createCard(cardData);
    cardSection.addItem(cardElement, false);
  }
}, '.elements');

const profileFormValidator = new FormValidator(validationConfig, document.getElementById('profile-form'));
const cardFormValidator = new FormValidator(validationConfig, document.getElementById('card-form'));
const avatarFormValidator = new FormValidator(validationConfig, document.getElementById('avatar-form'));

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

const openAvatarPopup = () => {
  avatarFormValidator.resetValidation();
  avatarPopupInstance.open();
};

document.querySelector('.profile__edit').addEventListener('click', openProfilePopup);
document.querySelector('.profile__add-button').addEventListener('click', openAddCardPopup);
document.querySelector('.profile__avatar-container').addEventListener('click', openAvatarPopup);

profilePopupInstance.setEventListeners();
addCardPopupInstance.setEventListeners();
imagePopupInstance.setEventListeners();
deleteCardPopupInstance.setEventListeners();
avatarPopupInstance.setEventListeners();

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();
avatarFormValidator.enableValidation();

loadAllData()
  .then(cardsData => {
    if (cardsData && cardsData.length > 0) {
      cardSection.renderItems(cardsData);
    } else {
      const localCards = [
        {
          name: "Valle de Yosemite",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '1'
        },
        {
          name: "Lago Louise",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '2'
        },
        {
          name: "Montañas Calvas",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '3'
        },
        {
          name: "Latemar",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '4'
        },
        {
          name: "Parque Nacional de la Vanoise",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '5'
        },
        {
          name: "Lago di Braies",
          link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg",
          likes: [],
          owner: { _id: currentUserId },
          _id: '6'
        }
      ];
      cardSection.renderItems(localCards);
    }
  })
  .catch(err => console.error('Error crítico:', err));