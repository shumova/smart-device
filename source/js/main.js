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

    document.querySelector('[footer]').classList.remove('footer--has-no-js');

    const accordionToggles = Array.from(document.querySelectorAll('[accordion-toggle]'));
    const accordionContents = Array.from(document.querySelectorAll('[accordion-content]'));

    if (accordionToggles && accordionToggles.length > 0 && accordionContents && accordionContents.length > 0) {
      const removeActiveClass = () => {
        accordionToggles.forEach((toggle) => toggle.classList.remove('is-active'));
        accordionContents.forEach((content) => content.removeAttribute('style'));
      };
      const updateActiveClass = (i) => {
        accordionToggles[i].classList.add('is-active');
        accordionContents[i].style.maxHeight = accordionContents[i].scrollHeight + 'px';
      };

      for (let i = 0; i < accordionToggles.length; i++) {
        accordionToggles[i].addEventListener('click', () => {
          if (accordionToggles[i].classList.contains('is-active')) {
            removeActiveClass();
          } else {
            removeActiveClass();
            updateActiveClass(i);
          }
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
