import StimulusReflex from 'stimulus_reflex'
import Sortable from "stimulus-sortable"

export default class extends Sortable {
  connect () {
    super.connect();
    StimulusReflex.register(this)
  }

  end ({ item, newIndex }) {
    this.stimulate("Todo#reposition", item, newIndex + 1);
  }
}