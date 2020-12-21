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
    this.shouldCloneDragged = event.item.querySelector('[data-todo-target="pinned"]').checked
  }

  dragEnd = event => {
    if (event.from === event.to) {
      this.stimulate(this.nameValue + '#positionItem', event.item, event.newIndex)
    } else {
      // handled by the dragAdd method
    }
  }

  dragAdd = event => {
    this.stimulate(
      this.nameValue + '#cloneTo',
      event.item,
      event.newIndex
    )
  }

  pullDragged = (to, from) => {
    if (
      typeof to.options !== 'undefined' &&
      to.options.group.name !== from.options.group.name
    ) {
      return false
    }

    return this.shouldCloneDragged ? 'clone' : true
  }
}
