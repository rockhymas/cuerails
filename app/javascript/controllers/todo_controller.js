import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

const uuidv4 = () => {
  const crypto = window.crypto || window.msCrypto
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned' ]

  connect () {
    super.connect()

    this.debouncedRename = debounce(() => {
      this.titleTarget.dataset.initiator = uuidv4();
      this.stimulate('Todo#rename', this.titleTarget);
    }, 2000);
  }

  complete(event) {
    this.stimulate('Todo#complete', this.checkboxTarget);
  }

  togglePin(event) {
    this.stimulate('Todo#togglePin', this.pinnedTarget);
  }

  rename() {
    this.onRename();
    this.debouncedRename();
  }

  onRename() {
    if (this.titleTarget.value === '') {
      this.checkboxTarget.classList.remove('border');
    }
    else {
      this.checkboxTarget.classList.add('border');
    }
  }

  serverRename(e) {
    if (e.detail.initiator === this.titleTarget.dataset.initiator) {
      delete this.titleTarget.dataset.initiator;
    } else {
      this.titleTarget.value = e.detail.title;
      this.onRename();
    }
  }

  blur() {
    this.debouncedRename.flush();
  }

  delete() {
    this.debouncedRename.flush();
    this.stimulate('Todo#delete', this.deleteTarget);
    if (this.titleTarget.value === '') {
      Velocity(this.element, 'slideUp');
    }
  }

  serverdelete(event) {
    Velocity(this.element, {opacity: 0}, {display: "none", complete: function() {
      this.element.remove();
    }.bind(this)});
  }

  keydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusNextTodo();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusPrevTodo();
    }
    if (e.key === 'Delete' && this.titleTarget.value === '') {
      e.preventDefault();
      this.focusNextTodo();
      this.delete();
    }
    if (e.key === 'Backspace' && this.titleTarget.value === '') {
      e.preventDefault();
      this.focusPrevTodo(true);
      this.delete();
    }
  }

  clickHandle() {
    if (this.optionsTarget.style.display === 'none') {
      Velocity(this.optionsTarget, 'slideDown', { display: "" });
    } else {
      Velocity(this.optionsTarget, 'slideUp');
    }
  }

  focusNextTodo() {
    const row = this.element.nextElementSibling
    if (row) {
      row.querySelector("input[type='text']").focus();
      // Velocity(row, {backgroundColor: '#2d842f'}).then(Velocity(row, {backgroundColor: '#FFF'}));
    }
  }

  focusPrevTodo(cursorAtEnd) {
    const row = this.element.previousElementSibling
    if (row) {
      const input = row.querySelector("input[type='text']")
      if (input) {
        input.focus();
        // Velocity(row, {backgroundColor: '#2d842f'}).then(Velocity(row, {backgroundColor: '#FFF'}));
        if (cursorAtEnd) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }
  }
}
