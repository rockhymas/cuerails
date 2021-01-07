import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = [ "dropdown" ]

  toggle(e) {
    if (this.dropdownTarget.classList.contains('hidden')) {
      // TODO: add listener for clicking anywhere else, which will dismiss the menu
      this.dropdownTarget.classList.remove('hidden');
    } else {
      // TODO: remove listener added above
      this.dropdownTarget.classList.add('hidden');
    }
  }
}
