import ApplicationController from './application_controller'
import consumer from '../channels/consumer'
import CableReady from 'cable_ready'
import debounce from 'lodash/debounce'

/* This is the custom StimulusReflex controller for the Example Reflex.
 * Learn more at: https://docs.stimulusreflex.com
 */
export default class extends ApplicationController {
  static targets = [ "checkbox", 'title', 'delete' ]

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
    // add your code here, if applicable
    this.subscription = consumer.subscriptions.create(
      {
        channel: 'TodoChannel',
        id: this.element.dataset.todoId
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
        }
      }
    )

    this.debouncedRename = debounce(() => {
      this.stimulate('Todo#rename', this.titleTarget);
    }, 1000);
  }

  disconnect () {
    super.disconnect();
    this.subscription.unsubscribe();
  }

  complete(event) {
    event.target.checked = !event.target.checked;
    this.stimulate('Todo#complete', this.checkboxTarget);
  }

  rename() {
    this.debouncedRename();
  }

  delete() {
    this.debouncedRename.flush();
    this.stimulate('Todo#delete', this.deleteTarget);
    this.element.style.display = 'none';
  }

  afterDelete(element, reflex, noop, reflexId) {
    const row = element.closest("[data-todo-id]");
    row.remove();
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
      this.focusNextTodo(e.target);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusPrevTodo(e.target);
    }
    if (e.key === 'Delete' && this.titleTarget.value === '') {
      e.preventDefault();
      this.focusNextTodo(e.target);
      this.delete();
    }
    if (e.key === 'Backspace' && this.titleTarget.value === '') {
      e.preventDefault();
      this.focusPrevTodo(e.target, true);
      this.delete();
    }
  }

  afterInsertAfter(element, reflex, noop, reflexId) {
    if (this.inserting) {
      this.focusNextTodo(element);
    }

    this.inserting = false;
  }

  focusNextTodo(element) {
    const row = element.closest("[data-todo-id]");
    if (row.nextElementSibling) {
      row.nextElementSibling.querySelector("input[type='text']").focus();
    }
  }

  focusPrevTodo(element, cursorAtEnd) {
    const row = element.closest("[data-todo-id]");
    if (row.previousElementSibling) {
      const input = row.previousElementSibling.querySelector("input[type='text']")
      input.focus();
      if (cursorAtEnd) {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    var timeout;

    const flush = function() {
      if (timeout === null) {
        return;
      }
      clearTimeout(timeout);
      func.apply(context, args);
    };

    function debounced() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };

    debounced.flush = flush;
    return debounced;
  };

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

  beforeComplete(element, reflex, noop, reflexId) {
   element.checked = !element.checked
  }

  // danceSuccess(element, reflex, noop, reflexId) {
  //   element.innerText = 'Danced like no one was watching! Was someone watching?'
  // }

  // danceError(element, reflex, error, reflexId) {
  //   console.error('danceError', error);
  //   element.innerText = "Couldn't dance!"
  // }
}
