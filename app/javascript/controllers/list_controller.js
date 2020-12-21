import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = ['title', 'items']

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

  keypress = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.inserting = true
      this.stimulate('List#insertTodo', this.element)
      this.titleTarget.blur()
    }
  }

  afterInsertTodo = () => {
    if (this.inserting) {
      this.focusNextTodo()
    }

    this.inserting = false
  }

  focusNextTodo = () => {
    const row = this.titleTarget.nextElementSibling
    if (row) {
      row.querySelector("input[type='text']").focus()
      Velocity(row, { backgroundColor: '#2d842f' }).then(
        Velocity(row, { backgroundColor: '#FFF' })
      )
    }
  }

  keydown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.focusNextTodo()
    }
  }
}
