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
    let errorMessage = 'Por favor, rellene este campo';

    if (inputElement.type === 'url' && inputElement.validity.typeMismatch) {
      errorMessage = 'Por favor, introduce una dirección web';
    }
    else if (inputElement.validity.tooShort) {
      const minLength = inputElement.minLength;
      const currentLength = inputElement.value.length;
      errorMessage = `Mínimo ${minLength} caracteres (actualmente ${currentLength})`;
    }
    else if (inputElement.validity.valueMissing) {
      errorMessage = 'Por favor, rellene este campo';
    }

    inputElement.addEventListener('invalid', (e) => {
      e.preventDefault();
    }, {once: true});

    showInputError(formElement, inputElement, errorMessage, settings);
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
    inputElement.addEventListener('focus', function() {
      this.setCustomValidity('');
    });

    inputElement.addEventListener('input', function() {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function(evt) {
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
    inputElement.setCustomValidity('');
  });

  toggleButtonState(inputList, buttonElement, settings);
}

export { enableValidation, clearValidation };