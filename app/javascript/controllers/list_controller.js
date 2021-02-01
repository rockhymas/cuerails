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
    templateNode.querySelector('[data-todo-target="title"]').value = e.detail.title || '';

    if (e.detail.cloneItemId) {
      templateNode.dataset.todoCloneIdValue = e.detail.cloneItemId;
    }

    let prevTodoElement = e.detail.prevTodoElement;
    let insertAt = 'afterend';
    let todoAfterValue = prevTodoElement ? (prevTodoElement.dataset.todoIdValue || undefined) : -1;
    templateNode.dataset.todoAfterValue = todoAfterValue;
    if (prevTodoElement == null) {
      // templateNode.dataset.todoAfterValue = -1;
      insertAt = 'afterbegin';
      prevTodoElement = this.itemsTarget;
    } else if (prevTodoElement.dataset.todoIdValue) {
      // templateNode.dataset.todoAfterValue = prevTodoElement.dataset.todoIdValue;
    }

    prevTodoElement.insertAdjacentElement(insertAt, templateNode);
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
