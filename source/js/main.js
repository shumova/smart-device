import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();

    // Фокус на поле имени

    const modalToggle = document.querySelector('[data-open-modal]');
    const nameInput = document.querySelector('[data-name-input]');
    const setFocus = () => nameInput.focus();

    if (nameInput && modalToggle) {
      modalToggle.addEventListener('click', () => setTimeout(() => setFocus(), 100));
    }

    // Удаление классов отключённого js

    Array.from(document.querySelectorAll('[data-has-no-js]')).forEach((element) => element.classList.remove('has-no-js'));

    // Функции для кнопок "скрыть"/"показать"

    const getPanelHeight = (panel) => {
      let panelHeight;
      panelHeight = panel.scrollHeight + 15 + 'px';
      return panelHeight;
    };

    const removeActiveClass = (togglesArray, panelsArray) => {
      togglesArray.forEach((toggle) => {
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Показать');
      });
      panelsArray.forEach((panel) => {
        panel.removeAttribute('style');
        panel.setAttribute('inert', 'true');
      });
    };

    const updateActiveClass = (togglesArray, panelsArray, i) => {
      togglesArray[i].classList.add('is-active');
      togglesArray[i].setAttribute('aria-expanded', 'true');
      togglesArray[i].setAttribute('aria-label', 'Скрыть');
      panelsArray[i].style.maxHeight = panelsArray[i].scrollHeight + 15 + 'px';
      panelsArray[i].style.paddingBottom = '15px';
      panelsArray[i].removeAttribute('inert');
    };

    const setEventListener = (togglesArray, panelsArray) => {
      if (togglesArray && togglesArray.length > 0 && panelsArray && panelsArray.length > 0) {
        for (let i = 0; i < togglesArray.length; i++) {
          if (panelsArray[i].clientHeight === 0) {
            panelsArray[i].setAttribute('inert', 'true');
          }
          togglesArray[i].addEventListener('click', () => {
            if (togglesArray[i].classList.contains('is-active')) {
              removeActiveClass(togglesArray, panelsArray);
            } else {
              removeActiveClass(togglesArray, panelsArray);
              updateActiveClass(togglesArray, panelsArray, i);
            }
          });
        }
      }
    };

    // Кнопка Подробнее

    const moreToggles = Array.from(document.querySelectorAll('[data-more-toggle]'));
    const moreContents = Array.from(document.querySelectorAll('[data-more-content]'));

    setEventListener(moreToggles, moreContents);

    // Аккордеон в footer

    const accordionToggles = Array.from(document.querySelectorAll('[data-accordion-toggle]'));
    const accordionContents = Array.from(document.querySelectorAll('[data-accordion-content]'));

    setEventListener(accordionToggles, accordionContents);

    // Ресайз высоты панелей аккордеона, текстовых

    let resizeTimeout;
    const resizeThrottler = (togglesArray, panelsArray) => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          for (let i = 0; i < togglesArray.length; i++) {
            if (window.innerWidth < 768 && !togglesArray[i].classList.contains('is-active')) {
              panelsArray[i].setAttribute('inert', 'true');
            } else {
              panelsArray[i].removeAttribute('inert');
            }

            if (togglesArray[i].classList.contains('is-active')) {
              let newPanelHeight = getPanelHeight(panelsArray[i]);
              panelsArray[i].style.maxHeight = newPanelHeight;
            }
          }
        }, 66);
      }
    };

    const allTogglesArrays = moreToggles.concat(accordionToggles);
    const allContentsArrays = moreContents.concat(accordionContents);

    window.addEventListener('resize', () => resizeThrottler(allTogglesArrays, allContentsArrays), false);

    // Маска для телефона

    const phoneInputs = document.querySelectorAll('[data-tel-input]');

    if (phoneInputs && phoneInputs.length > 0) {

      let getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, '');
      };

      let onPhoneInput = (e) => {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let selectionStart = input.selectionStart;
        let formattedInputValue = '';

        if (!inputNumbersValue) {
          input.value = '';
        }

        if (input.value.length !== selectionStart) {
          if (e.data && /\D/g.test(e.data)) {
            input.value = inputNumbersValue;
          }
          return;
        }

        let firstNumber = input.value[0] !== '+' ? input.value[0] : '';

        formattedInputValue = input.value = '+7(' + firstNumber;
        if (inputNumbersValue.length > 1) {
          formattedInputValue += inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
        }
        input.value = formattedInputValue;
      };

      let onPhoneKeyDown = function (e) {
        let inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode === 8 && inputValue.length === 1) {
          e.target.value = '';
        }
      };

      for (let phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', (event) => {
          event.preventDefault();
        });
      }
    }
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
