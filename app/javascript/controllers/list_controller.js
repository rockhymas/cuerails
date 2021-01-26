import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = ['title', 'items', 'template']

  connect () {
    super.connect()

    this.debouncedRename = debounce(() => {
      this.stimulate('List#rename', this.titleTarget)
    }, 1000)
  }

  rename = () => {
    this.debouncedRename()
  }

  blur = () => {
    this.debouncedRename.flush()
  }

  paste = event => {
    event.preventDefault()
    let text = (event.originalEvent || event).clipboardData.getData(
      'text/plain'
    )
    text = text.split('\r\n').join(' ')
    text = text.split('\n').join(' ')
    text = text.split('\r').join(' ')
    window.document.execCommand('insertText', false, text)
  }

  insertOnEnter= e => {
    if (e.key === 'Enter') {
      e.preventDefault();

      let templateNode = this.templateTarget.cloneNode(true);
      templateNode.classList.remove('hidden');
      delete templateNode.dataset.listTarget

      let prevTodoElement = e.target.closest('[data-controller*="todo"]'); // this works for new-todo controllers as well
      if (prevTodoElement == null) {
        // inserting at start of list
        this.itemsTarget.insertAdjacentElement("afterbegin", templateNode);
        templateNode.dataset.newTodoAfterValue = -1
      } else {
        prevTodoElement.insertAdjacentElement("afterend", templateNode);
        if (prevTodoElement.dataset.todoId) {
          templateNode.dataset.newTodoAfterValue = prevTodoElement.dataset.todoId
        } // else new-todo controller will update next todo element when it gets a todoId
      }
    }
  }

  focusNextTodo = () => {
    const row = this.titleTarget.nextElementSibling
    if (row) {
      row.querySelector("input[type='text']").focus()
      // Velocity(row, { backgroundColor: '#2d842f' }).then(Velocity(row, { backgroundColor: '#FFF' }));
    }
  }

  keydown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.focusNextTodo()
    }
  }
}
