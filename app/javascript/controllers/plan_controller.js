import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = [ "plan" ]

  connect () {
    super.connect();
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(this.element, { attributeFilter: ['data-plan-target'], childList: true, subtree: true });
    this.onMutation();
  }

  disconnect() {
    super.disconnect();
    this.observer.disconnect();
  }

  onMutation = () => {
    if (!this.hasPlanTarget) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
}
