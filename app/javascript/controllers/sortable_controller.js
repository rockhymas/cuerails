import ApplicationController from './application_controller'
import Sortable from 'sortablejs'

export default class extends ApplicationController {
  static values = { name: String }

  connect () {
    super.connect()

    const options = {
      group: { name: this.nameValue, pull: this.pullDragged, revertClone: true },
      animation: this.data.get('animation') || 150,
      handle: this.data.get('handle') || undefined,
      removeCloneOnHide: false,
      onStart: this.dragStart,
      onEnd: this.dragEnd,
      onAdd: this.dragAdd,
    }

    this.sortable = new Sortable(this.element, options)
  }

  dragStart = event => {
    // TODO: figure out how to indicate pinned status in items
    let el = event.item.querySelector('[data-todo-target="pinned"]')
    this.shouldCloneDragged = el === null ? false : el.checked
  }

  dragEnd = event => {
    if (event.from === event.to && event.newIndex !== event.oldIndex) {
      this.stimulate(this.nameValue + '#positionItem', event.item, event.newIndex)
    } else {
      // handled by the dragAdd method
    }
  }

  dragAdd = event => {
    const title = event.item.querySelector('[data-todo-target="title"]').value;
    const prevTodoElement = event.item.previousElementSibling;
    const cloneItemId = event.item.dataset.todoIdValue;
    event.item.remove();
    const e = new CustomEvent('insertTodo', { bubbles: true, detail: { cloneItemId, title, prevTodoElement } });
    this.element.dispatchEvent(e);
  }

  pullDragged = (to, from) => {
    if (typeof to.options !== 'undefined' && to.options.group.name !== from.options.group.name) {
      return false
    }

    return this.shouldCloneDragged ? 'clone' : true
  }
}
