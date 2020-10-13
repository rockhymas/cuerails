import consumer from "./consumer"

document.addEventListener("turbolinks:load", function() {
  document.querySelectorAll('[data-channel-subscribe="list"]').forEach(function(element) {
    var list_id = element.dataset.listId,
        todoTemplate = document.querySelector('[data-role="todo-template"]');

    // $element.animate({ scrollTop: $element.prop("scrollHeight")}, 1000)        

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
          // element.animate({ scrollTop: element.prop("scrollHeight")}, 1000);
        }
      }
    );
  });
});