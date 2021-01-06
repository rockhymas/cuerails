import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = [ "dropdown" ]

  toggle(e) {
    if (this.dropdownTarget.classList.contains('hidden')) {
      this.dropdownTarget.classList.remove('hidden');
    } else {
      this.dropdownTarget.classList.add('hidden');
    }
  }
}
