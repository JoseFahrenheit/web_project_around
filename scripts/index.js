import { Card } from "./Card.js";
import { FormValidator } from "./FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { PopupWithForm } from "../components/PopupWithForm.js";
import { UserInfo } from "../components/UserInfo.js";
import { Api } from "../components/Api.js";
import { PopupWithConfirmation } from "../components/PopupWithConfirmation.js";

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
    authorization: "02c5cb3d-f95a-461a-a48e-8ed3895c99a5",
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
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
      avatar: userData.avatar,
      userId: userData._id
    });
    const processedCards = cardsData.map(card => ({
      ...card,
      isLiked: card.likes.some(like => like._id === userData._id),
      userId: userData._id,
      ownerId: card.owner._id
    }));
    return processedCards;
  })
  .catch(err => {
    console.error('Error al cargar datos:', err);
    userInfo.setUserInfo({
      name: 'Jacques Cousteau',
      job: 'Explorador',
      avatar: 'https://practicum-content.s3.us-west-1.amazonaws.com/frontend-developer/common/avatar.jpg',
      userId: 'default'
    });
    return [];
  });
}

const profilePopupInstance = new PopupWithForm(
  '#edit-profile-popup',
  (formData) => {
    profilePopupInstance.setLoadingState(true);
    api.updateUserInfo({
      name: formData.name,
      about: formData.about
    })
    .then(updatedData => {
      userInfo.setUserInfo({
        name: updatedData.name,
        job: updatedData.about,
        avatar: updatedData.avatar
      });
      profilePopupInstance.close();
    })
    .catch(err => {
      console.error('Error al actualizar perfil:', err);
    })
    .finally(() => {
      profilePopupInstance.setLoadingState(false);
    });
  }
);

const addCardPopupInstance = new PopupWithForm(
  '#add-element-popup',
  (formData) => {
    addCardPopupInstance.setLoadingState(true, 'Creando...');

    api.addNewCard({
      name: formData.title,
      link: formData.link
    })
    .then(newCard => {
      const userData = userInfo.getUserInfo();
      const card = new Card(
        {
          name: newCard.name,
          link: newCard.link,
          _id: newCard._id,
          likes:  newCard.likes,
          isLiked: false,
          userId: userData.userId,
          ownerId: userData._id
        },
        '#card-template',
        (src, alt) => imagePopupInstance.open({ src, alt }),
        (cardId, isLiked) => api.toggleLike(cardId, isLiked),
        (cardId, cardElement) =>deleteCardPopupInstance.open(cardId, cardElement)
      ).generateCard();

      cardSection.addItem(card);
      addCardPopupInstance.close();
    })
    .catch(err => {
      console.error('Error al agregar tarjeta:', err);
    })
    .finally(() => {
      addCardPopupInstance.setLoadingState(false, 'Crear');
    });
  }
);

const deleteCardPopupInstance = new PopupWithConfirmation(
  '#delete-card-popup',
  (cardId, cardElement) => {
    deleteCardPopupInstance.setLoadingState(true);
    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        deleteCardPopupInstance.close();
      })
      .catch(err => {
        console.error('Error al eliminar tarjeta:', err);
      })
      .finally(() => {
        deleteCardPopupInstance.setLoadingState(false);
      });
  }
);

const imagePopupInstance = new PopupWithImage('#image-popup');

const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      const card = new Card(
        {
          name: cardData.name,
          link: cardData.link,
          _id: cardData._id,
          likes: cardData.likes,
          isLiked: cardData.isLiked,
          userId: cardData.userId,
          ownerId: cardData.ownerId
        },
        '#card-template',
        (src, alt) => imagePopupInstance.open({ src, alt}),
        (cardId, isLiked) => api.toggleLike(cardId, isLiked),
        (cardId, cardElement) => deleteCardPopupInstance.open(cardId, cardElement)
      ).generateCard();
      cardSection.addItem(card);
    }
  },
  '.elements'
)

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
deleteCardPopupInstance.setEventListeners();

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();

loadAllData()
  .then(cardsData => {
    console.log('Datos recibidos:', cardsData);
    if (cardsData && cardsData.length > 0) {
      cardSection.renderItems(cardsData);
    } else {
      const localCards = [
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
      cardSection.renderItems(localCards);
    }
  })
  .catch(err => {
    console.error('Error critico:', err);
  });