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
    let prevTodoElement = e.detail.prevTodoElement;

    // Make a todo node from the template and the event details
    let newTodoNode = this.templateTarget.cloneNode(true);
    delete newTodoNode.dataset.listTarget;
    newTodoNode.classList.remove('hidden');
    newTodoNode.querySelector('[data-todo-target="title"]').value = e.detail.title || '';
    newTodoNode.dataset.todoCloneIdValue = e.detail.cloneItemId;
    newTodoNode.dataset.todoAfterValue = prevTodoElement ? prevTodoElement.dataset.todoIdValue : -1;

    // Insert it
    if (prevTodoElement) {
      prevTodoElement.insertAdjacentElement('afterend', newTodoNode);
    } else {
      this.itemsTarget.insertAdjacentElement('afterbegin', newTodoNode);
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
