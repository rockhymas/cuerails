import { Controller } from 'stimulus'; 
import consumer from "channels/consumer"

export default class extends Controller {
  static targets = ["template"];

  connect() {
    console.log("hello from StimulusJS")
    var element = this.element;
    var list_id = element.dataset.listId,
    todoTemplate = this.templateTarget;

    consumer.subscriptions.create(
      {
        channel: "ListChannel",
        list: list_id
      },
      {
        received: function(data) {
          var content = todoTemplate.cloneNode(true);
          content.querySelector('[data-role="todo-title"]').textContent = data.title;
          [...content.children].forEach(function(child) { element.appendChild(child); });
        }
      }
    );

  }
}