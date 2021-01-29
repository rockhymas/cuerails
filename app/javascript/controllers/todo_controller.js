import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned' ]

  connect () {
    super.connect();

    this.debouncedRename = debounce(() => {
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

  blur() {
    this.debouncedRename.flush();
  }

  delete() {
    this.debouncedRename.cancel();
    this.animationPromise = Velocity(this.element, 'slideUp');
    this.stimulate('Todo#delete', this.deleteTarget);
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
      const input = row.querySelector("input[type='text']");
      if (input) {
        input.focus();
        if (cursorAtEnd) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }
  }
}
