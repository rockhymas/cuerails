import StimulusReflex from 'stimulus_reflex'
import Sortable from "stimulus-sortable"
import consumer from '../channels/consumer'
import CableReady from 'cable_ready'

export default class extends Sortable {
  connect () {
    super.connect();
    StimulusReflex.register(this)

    this.subscription = consumer.subscriptions.create(
      {
        channel: 'ListChannel',
        id: this.element.dataset.listId
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
        }
      }
    )
  }

  disconnect () {
    super.disconnect();
    this.subscription.unsubscribe();
  }

  end ({ item, newIndex }) {
    this.stimulate("Todo#reposition", item, newIndex + 1);
  }
}