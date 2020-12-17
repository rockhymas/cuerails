import Velocity from 'velocity-animate'
import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

/* This is the custom StimulusReflex controller for the Example Reflex.
 * Learn more at: https://docs.stimulusreflex.com
 */
export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete', 'handle', 'options', 'pinned' ]

  /*
   * Regular Stimulus lifecycle methods
   * Learn more at: https://stimulusjs.org/reference/lifecycle-callbacks
   *
   * If you intend to use this controller as a regular stimulus controller as well,
   * make sure any Stimulus lifecycle methods overridden in ApplicationController call super.
   *
   * Important:
   * By default, StimulusReflex overrides the -connect- method so make sure you
   * call super if you intend to do anything else when this controller connects.
  */

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
    Velocity(this.element, {opacity: 0}, {display: "none"});
  }

  serverdelete(event) {
    console.log(event);
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

  /* Reflex specific lifecycle methods.
   *
   * For every method defined in your Reflex class, a matching set of lifecycle methods become available
   * in this javascript controller. These are optional, so feel free to delete these stubs if you don't
   * need them.
   *
   * Important:
   * Make sure to add data-controller="example" to your markup alongside
   * data-reflex="Example#dance" for the lifecycle methods to fire properly.
   *
   * Example:
   *
   *   <a href="#" data-reflex="click->Example#dance" data-controller="example">Dance!</a>
   *
   * Arguments:
   *
   *   element - the element that triggered the reflex
   *             may be different than the Stimulus controller's this.element
   *
   *   reflex - the name of the reflex e.g. "Example#dance"
   *
   *   error/noop - the error message (for reflexError), otherwise null
   *
   *   reflexId - a UUID4 or developer-provided unique identifier for each Reflex
   */

  // Assuming you create a "Example#dance" action in your Reflex class
  // you'll be able to use the following lifecycle methods:

  // beforeDance(element, reflex, noop, reflexId) {
  // }

  // danceSuccess(element, reflex, noop, reflexId) {
  //   element.innerText = 'Danced like no one was watching! Was someone watching?'
  // }

  // danceError(element, reflex, error, reflexId) {
  //   console.error('danceError', error);
  //   element.innerText = "Couldn't dance!"
  // }
}
