import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned' ]

  connect () {
    super.connect()

    this.debouncedRename = debounce(() => {
      this.renaming = true;
      this.stimulate('Todo#rename', this.titleTarget);
    }, 1000);
  }

  complete(event) {
    this.stimulate('Todo#complete', this.checkboxTarget);
  }

  togglePin(event) {
    this.stimulate('Todo#togglePin', this.pinnedTarget);
  }

  rename() {
    if (this.titleTarget.dataset.pendingRename) {
      delete this.titleTarget.dataset.pendingRename;
      this.titleTarget.classList.remove('pendingRename');
    }
    this.debouncedRename();
  }

  afterRename() {
    if (this.titleTarget === document.activeElement && !this.renaming) {
      if (!document.hasFocus()) {
        this.titleTarget.blur();
        this.stimulate('Todo#forceUpdate');
      } else {
        this.titleTarget.dataset.pendingRename = this.titleTarget.value;
        this.titleTarget.classList.add('pendingRename');
      }
    }

    this.renaming = false;
  }

  blur() {
    this.debouncedRename.flush();
    if (this.titleTarget.dataset.pendingRename &&
        this.titleTarget.dataset.pendingRename == this.titleTarget.value) {
      delete this.titleTarget.dataset.pendingRename;
      this.stimulate('Todo#forceUpdate');
      this.titleTarget.classList.remove('pendingRename');
    }
  }

  delete() {
    this.debouncedRename.flush();
    this.stimulate('Todo#delete', this.deleteTarget);
    // Velocity(this.element, {opacity: 0}, {display: "none"});
  }

  serverdelete(event) {
    Velocity(this.element, {opacity: 0}, {display: "none", complete: function() {
      this.element.remove();
    }.bind(this)});
  }

  keypress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.inserting = true;
      this.stimulate('Todo#insertAfter', this.element);
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
      Velocity(this.optionsTarget, 'slideDown');
    } else {
      Velocity(this.optionsTarget, 'slideUp');
    }
  }

  afterInsertAfter() {
    if (this.inserting) {
      this.focusNextTodo();
    }

    this.inserting = false;
  }

  focusNextTodo() {
    const row = this.element.nextElementSibling
    if (row) {
      row.querySelector("input[type='text']").focus();
      Velocity(row, {backgroundColor: '#2d842f'}).then(Velocity(row, {backgroundColor: '#FFF'}));
    }
  }

  focusPrevTodo(cursorAtEnd) {
    const row = this.element.previousElementSibling
    if (row) {
      const input = row.querySelector("input[type='text']")
      if (input) {
        input.focus();
        Velocity(row, {backgroundColor: '#2d842f'}).then(Velocity(row, {backgroundColor: '#FFF'}));
        if (cursorAtEnd) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }
  }
}
