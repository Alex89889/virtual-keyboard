
class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    };

    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };

    this.properties = {
      value: '',
      capsLock: false,
    };

    this.keyLayoutEng = [
      '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?', 'Shift',
      'Space',
    ];

    this.keyLayoutRussian = [
      '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift',
      'Space',
    ];
  }

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    // check lunguage
    const lung = document.getElementById('lung').value;
    if (lung === 'Eng') {
      this.keyLayout = this.keyLayoutEng;
    } else if (lung === 'Rus') {
      this.keyLayout = this.keyLayoutRussian;
    } else {
      this.keyLayout = this.keyLayoutEng;
    }

    this.keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['Backspace', '\\', 'Enter', 'Shift'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this.triggerEvent('oninput');
          });

          break;

        case 'CapsLock':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'Enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });

          break;

        case 'Space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = ' ';

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value += '   ';
            this.triggerEvent('oninput');
          });

          break;

        case 'Shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    });
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  }

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }

  static setFocus() {
    document.getElementById('textarea-keyboard').focus();
  }

  clickKey(event) {
    if (event.ctrlKey && event.altKey) {
      const countLung = document.getElementById('lung').value;
      if (countLung === 'Eng') {
        document.getElementById('lung').value = 'Rus';
      } else if (countLung === 'Rus') {
        document.getElementById('lung').value = 'Eng';
      }
      const node = document.querySelector('.keyboard');
      node.parentNode.removeChild(node);

      this.init();
      document.getElementById('textarea-keyboard').focus();
    }
    const elements = document.querySelectorAll('button');
    elements.forEach((elem) => {
      if (event.key === elem.textContent || event.code === elem.textContent) {
        elem.style.backgroundColor = 'black';
      }
    });
  }

  static upKey() {
    const elements = document.querySelectorAll('button');

    elements.forEach((elem) => {
      elem.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
  }

  static printMain() {
    document.body.innerHTML = `<h1>RSS Виртуальная клавиатура</h1>
<input type="hidden" id="lung" value = "Eng">
<textarea class="use-keyboard-input" id="textarea-keyboard"></textarea>`;
  }
}

document.addEventListener('keydown', (event) => {
  const keyboard = new Keyboard(document.getElementById('lung').value);
  keyboard.clickKey(event);
});

document.addEventListener('keyup', () => {
  Keyboard.upKey();
});


window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  Keyboard.printMain();
  keyboard.init();
  Keyboard.setFocus();
});
