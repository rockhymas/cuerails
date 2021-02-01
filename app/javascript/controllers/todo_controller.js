import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned', 'replacement' ]
  static values = { uuid: String, after: Number, cloneId: Number, id: Number }

  connect () {
    super.connect();

    if (!!this.element.dataset.listTarget) { // If we're not a template node. Alternatively, could look for the hidden class
      return;
    }

    if (this.hasIdValue) {
      this.debouncedRename = debounce(() => {
        this.stimulate('Todo#rename', this.titleTarget);
      }, 2000);
    } else {
      const uuidValue = this.uuidv4();
      const el = document.createElement('div');
      el.id = 'a' + uuidValue;
      el.classList.add('hidden');
      el.dataset.todoTarget = 'replacement';
      this.element.insertAdjacentElement('beforeend', el);
      this.titleTarget.focus();
      this.onRename();
      this.uuidValue = uuidValue;
    }
  }

  uuidValueChanged = () => {
    this.newTodoCheck();
  }

  afterValueChanged = () => {
    this.newTodoCheck();
  }

  newTodoCheck = () => {
    if (this.hasAfterValue && Number.isFinite(this.afterValue) && this.hasUuidValue) {
      const cloneId = this.hasCloneIdValue ? this.cloneIdValue : null;
      this.stimulate('List#newTodo', this.element, this.uuidValue, this.afterValue, cloneId);
    }
  }

  finalizeNewTodo() {
    // Copy over any changes to the new todo elements
    // ensure reflexes are stimulated
    // Tear self down, make it all seamless
    const replacement = this.replacementTarget.querySelector('div');
    replacement.remove();

    const focus = document.activeElement === this.titleTarget;
    const title_text = this.titleTarget.value;
    const title = replacement.querySelector('[data-todo-target="title"]');

    // If the next sibling is a todo controller, it needs an "after" value so it can position itself.
    const row = this.element.nextElementSibling
    if (row) {
      row.dataset.todoAfterValue = replacement.dataset.todoIdValue
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
    if (this.hasIdValue) {
      this.stimulate('Todo#complete', this.checkboxTarget);
    }
  }

  togglePin(event) {
    if (this.hasIdValue) {
      this.stimulate('Todo#togglePin', this.pinnedTarget);
    }
  }

  rename() {
    this.onRename();
    if (this.hasIdValue) {
      this.debouncedRename();
    }
  }

  onRename() {
    if (this.titleTarget.value === '') {
      this.checkboxTarget.classList.remove('border');
    }
    else {
      this.checkboxTarget.classList.add('border');
    }
  }

  blur() {
    if (this.hasIdValue) {
      this.debouncedRename.flush();
    }
  }

  delete() {
    if (this.hasIdValue) {
      this.debouncedRename.cancel();
      this.animationPromise = Velocity(this.element, 'slideUp');
      this.stimulate('Todo#delete', this.deleteTarget);
    }
  }

  afterDelete() {
    this.animationPromise.then(() => {
      this.element.remove();
    });
  }

  keypress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let prevTodoElement = this.element;
      const event = new CustomEvent('insertTodo', { bubbles: true, detail: { prevTodoElement } });
      this.element.dispatchEvent(event);
    }
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
      this.delete();
      this.focusNextTodo();
    }
    if (e.key === 'Backspace' && this.titleTarget.value === '') {
      e.preventDefault();
      this.delete();
      this.focusPrevTodo(true);
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
    }
  }

  focusPrevTodo(cursorAtEnd) {
    const row = this.element.previousElementSibling
    if (row) {
      const input = row.querySelector("input[type='text']")
      if (input) {
        input.focus();
        if (cursorAtEnd) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }
  }
}
