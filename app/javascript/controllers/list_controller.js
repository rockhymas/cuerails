import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = ['title', 'items', 'template']

  connect () {
    super.connect()

    this.debouncedRename = debounce(() => {
      this.renaming = true
      this.stimulate('List#rename', this.titleTarget)
    }, 1000)
  }

  rename = () => {
    if (this.titleTarget.dataset.pendingRename) {
      delete this.titleTarget.dataset.pendingRename
      this.titleTarget.classList.remove('pendingRename')
    }
    this.debouncedRename()
  }

  afterRename = () => {
    if (this.titleTarget === document.activeElement && !this.renaming) {
      if (!document.hasFocus()) {
        this.titleTarget.blur()
        this.stimulate('List#forceUpdate')
      } else {
        this.titleTarget.dataset.pendingRename = this.titleTarget.value
        this.titleTarget.classList.add('pendingRename')
      }
    }

    this.renaming = false
  }

  blur = () => {
    this.debouncedRename.flush()
    if (
      this.titleTarget.dataset.pendingRename &&
      this.titleTarget.dataset.pendingRename == this.titleTarget.value
    ) {
      delete this.titleTarget.dataset.pendingRename
      this.stimulate('List#forceUpdate')
      this.titleTarget.classList.remove('pendingRename')
    }
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
      this.inserting = true;
      // this.stimulate('List#insertTodo', e.target);

      let templateNode = this.templateTarget.cloneNode(true);
      let controller = e.target.closest('[data-controller*="todo"]');

      templateNode.classList.remove('hidden');
      delete templateNode.dataset.listTarget
      templateNode.dataset.newTodoAfterValue = controller.dataset.todoId // TODO: What if dataset.todoId doesn't exist, because controller is a new todo?
      controller.insertAdjacentElement("afterend", templateNode);

      // let todoNode = this.templateTarget.querySelector('[data-controller*="new-todo"]').cloneNode(true);
      // let controller = e.target.closest('[data-controller*="todo"]');
      // console.log(controller);
      // console.log(todoNode);
      // controller.insertAdjacentElement('afterend', todoNode);
      // todoNode.querySelector("input[type='text']").focus();

      // this.inserting = true;
      // this.stimulate('List#newTodo', e.target);

      // generate html for new todo, data-todo-uuid = uuid, data-todo-id=new, id=todo-row-uuid
      // what about id's for child elements that use the todo.id?
      // Make todo_controller.js/todo_reflex.rb handle uuid, when they exist, across all methods
      // Probably just prevent reflexes (rename/check/pin/delete) until todo.id is set
      // stimulate('List#insertAfter', todo-id, new uuid)
      // ^-- handler will hook up the new id once the todo is created
      // afterInsertAfter will update the new todo with anything that happened while waiting, i.e. rename
      //   and also do a stimulate that triggers cable ready updates for all other clients

    }
  }

  afterInsertTodo = () => {
    // if (this.inserting) {
    //   this.focusNextTodo()
    // }

    this.inserting = false
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
