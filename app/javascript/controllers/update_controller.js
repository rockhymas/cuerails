import ApplicationController from './application_controller'
import CableReady from 'cable_ready'

export default class extends ApplicationController {
  static values = {
    name: String,
    id: Number
  }

  connect () {
    super.connect()

    this.subscription = this.application.consumer.subscriptions.create(
      {
        channel: this.nameValue + 'Channel',
        id: this.idValue
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
        }
      }
    )
  }

  disconnect () {
    this.subscription.unsubscribe()
  }
}
