import ApplicationController from './application_controller'

const uuidv4 = () => {
  const crypto = window.crypto || window.msCrypto
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export default class extends ApplicationController {
  static values = { id: String }

  connect () {
    super.connect()
    if (!this.hasIdValue) {
      this.idValue = uuidv4();
    }
    this.element.addEventListener('cable-ready:before-morph', this.onCableReady);
    this.element.addEventListener('cable-ready:before-insert-adjacent-html', this.onCableReady);
  }

  disconnect () {
    this.element.removeEventListener('cable-ready:before-morph', this.onCableReady);
    this.element.removeEventListener('cable-ready:before-insert-adjacent-html', this.onCableReady);
  }

  onCableReady = (operation) => {
    if (operation.detail.exemptId === this.idValue) {
      console.log('cancelling operation: ' + operation.detail);
      operation.detail.cancel = true;
    }
  }
}
