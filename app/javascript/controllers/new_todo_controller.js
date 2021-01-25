import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'

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
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned', 'replacement' ]
  static values = { uuid: String, after: Number }

  connect () {
    super.connect();
    if (!this.element.dataset.listTarget) { // If we're not a template node. Alternatively, could look for the hidden class
      this.uuidValue = uuidv4();
      const el = document.createElement('div');
      el.id = 'a'+this.uuidValue;
      el.classList.add('hidden');
      el.dataset.newTodoTarget = 'replacement';
      this.element.insertAdjacentElement('beforeend', el);
      this.titleTarget.focus();
      this.afterValueChanged();
    }
  }

  afterValueChanged = () => {
    if (this.hasAfterValue && this.hasUuidValue) {
      this.stimulate('List#newTodo', this.element, this.uuidValue, this.afterValue);
    }
  }

  finalizeNewTodo() {
    // Copy over any changes to the new todo elements
    // ensure reflexes are stimulated
    // Tear self down, make it all seamless
    console.log('after new todo');
    const replacement = this.replacementTarget.querySelector('div');
    replacement.remove();

    const focus = document.activeElement === this.titleTarget;
    const title_text = this.titleTarget.value;
    const title = replacement.querySelector('[data-todo-target="title"]');

    // If the next sibling is a new-todo controller, it needs an "after" value so it can position itself.
    const row = this.element.nextElementSibling
    if (row) {
      row.dataset.newTodoAfterValue = replacement.dataset.todoId
    }

    this.element.insertAdjacentElement('afterend', replacement);
    this.element.remove();

    if (title.value !== title_text) {
      title.value = title_text;
      title.dispatchEvent(new Event('input'));
    }
    if (focus) {
      title.focus();
    }
  }

  complete(event) {
  }

  togglePin(event) {
  }

  rename() {
  }

  onRename() {
    if (this.titleTarget.value === '') {
      this.checkboxTarget.classList.remove('border');
    }
    else {
      this.checkboxTarget.classList.add('border');
    }
  }

  delete() {
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
