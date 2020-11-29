import StimulusReflex from 'stimulus_reflex'
import ApplicationController from './application_controller'
import Sortable from 'sortablejs'
import consumer from '../channels/consumer'
import CableReady from 'cable_ready'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {
  static targets = [ 'title', 'items' ]

  initialize () {
    this.end = this.end.bind(this);
    this.add = this.add.bind(this);
  }

  connect () {
    super.connect();
    StimulusReflex.register(this);

    this.subscription = consumer.subscriptions.create(
      {
        channel: 'ListChannel',
        id: this.element.dataset.listId
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations);
        }
      }
    );

    const options = {
      group: 'list',
      animation: this.data.get('animation') || 150,
      handle: this.data.get('handle') || undefined,
      onEnd: this.end,
      onAdd: this.add
    };

    this.sortable = new Sortable(this.itemsTarget, options);

    this.debouncedRename = debounce(() => {
      this.renaming = true;
      this.titleTarget.dataset.value = this.titleTarget.innerText;
      this.stimulate('List#rename', this.titleTarget);
    }, 1000);
  }

  disconnect () {
    super.disconnect();
    this.subscription.unsubscribe();
  }

  add(event) {
    console.log('adding');
    console.log(event);
  }

  end(event) {
    this.stimulate("Todo#reposition", event.item, event.newIndex);
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
        this.stimulate('List#forceUpdate');
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
      this.stimulate('List#forceUpdate');
      this.titleTarget.classList.remove('pendingRename');
    }
  }

  paste (event) {
    event.preventDefault()
    let text = (event.originalEvent || event).clipboardData.getData('text/plain')
    text = text.split('\r\n').join(' ');
    text = text.split('\n').join(' ');
    text = text.split('\r').join(' ');
    window.document.execCommand('insertText', false, text)
  }

  keypress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.inserting = true;
      this.stimulate('List#insertTodo', this.element);
      this.titleTarget.blur();
    }
  }

  afterInsertTodo() {
    if (this.inserting) {
      this.focusNextTodo();
    }

    this.inserting = false;
  }

  focusNextTodo() {
    const row = this.titleTarget.nextElementSibling;
    if (row) {
      row.querySelector("input[type='text']").focus();
      Velocity(row, {backgroundColor: '#2d842f'}).then(Velocity(row, {backgroundColor: '#FFF'}));
    }
}

  keydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusNextTodo();
    }
    // if (e.key === 'ArrowUp') {
    //   e.preventDefault();
    //   this.focusPrevTodo(e.target);
    // }
    // if (e.key === 'Delete' && this.titleTarget.value === '') {
    //   e.preventDefault();
    //   this.focusNextTodo(e.target);
    //   this.delete();
    // }
    // if (e.key === 'Backspace' && this.titleTarget.value === '') {
    //   e.preventDefault();
    //   this.focusPrevTodo(e.target, true);
    //   this.delete();
    // }
  }
}