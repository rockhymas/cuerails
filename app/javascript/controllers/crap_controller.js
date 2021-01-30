import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static values = { id: String }

  connect () {
    super.connect()
    if (!this.hasIdValue) {
      this.idValue = this.uuidv4();
    }
    this.element.addEventListener('cable-ready:before-morph', this.onCableReady);
    this.element.addEventListener('cable-ready:before-insert-adjacent-html', this.onCableReady);
    this.element.addEventListener('cable-ready:before-remove', this.onCableReady);
  }

  disconnect () {
    this.element.removeEventListener('cable-ready:before-morph', this.onCableReady);
    this.element.removeEventListener('cable-ready:before-insert-adjacent-html', this.onCableReady);
    this.element.removeEventListener('cable-ready:before-remove', this.onCableReady);
  }

  onCableReady = (operation) => {
    if (operation.detail.exemptId === this.idValue) {
      console.log('cancelling operation: ');
      console.log(operation.detail);
      operation.detail.cancel = true;
    }
  }
}
