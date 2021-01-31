import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = ['title', 'items', 'template']

  connect () {
    super.connect();

    this.debouncedRename = debounce(() => {
      this.stimulate('List#rename', this.titleTarget);
    }, 1000);
  }

  rename = () => {
    this.debouncedRename();
  }

  blur = () => {
    this.debouncedRename.flush();
  }

  paste = event => {
    event.preventDefault();
    let text = (event.originalEvent || event).clipboardData.getData('text/plain');
    text = text.split('\r\n').join(' ');
    text = text.split('\n').join(' ');
    text = text.split('\r').join(' ');
    window.document.execCommand('insertText', false, text);
  }

  insertOnEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.insert({ detail: {} });
    }
  }

  insert = e => {
    let templateNode = this.templateTarget.cloneNode(true);
    delete templateNode.dataset.listTarget;
    templateNode.classList.remove('hidden');

    let prevTodoElement = null;
    if (e.detail.cloneItem) {
      prevTodoElement = e.detail.cloneItem.previousElementSibling;
      templateNode.dataset.todoCloneIdValue = e.detail.cloneItem.dataset.todoIdValue;
      e.detail.cloneItem.remove();
    } else {
      prevTodoElement = e.detail.prevTodoElement;
    }

    if (e.detail.title) {
      templateNode.querySelector('[data-todo-target="title"]').value = e.detail.title;
    }

    if (prevTodoElement == null) {
      // inserting at start of list
      this.itemsTarget.insertAdjacentElement("afterbegin", templateNode);
      templateNode.dataset.todoAfterValue = -1;
    } else {
      prevTodoElement.insertAdjacentElement("afterend", templateNode);
      if (prevTodoElement.dataset.todoIdValue) {
        templateNode.dataset.todoAfterValue = prevTodoElement.dataset.todoIdValue;
      } // else todo controller will update next todo element when it gets a todoIdValue
    }
  }

  focusFirstTodo = () => {
    this.itemsTarget.querySelector("input[type='text']").focus();
  }

  keydown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusFirstTodo();
    }
  }
}
