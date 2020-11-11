# frozen_string_literal: true

class TodoReflex < ApplicationReflex
  include CableReady::Broadcaster

  # Add Reflex methods in this file.
  #
  # All Reflex instances expose the following properties:
  #
  #   - connection - the ActionCable connection
  #   - channel - the ActionCable channel
  #   - request - an ActionDispatch::Request proxy for the socket connection
  #   - session - the ActionDispatch::Session store for the current visitor
  #   - url - the URL of the page that triggered the reflex
  #   - element - a Hash like object that represents the HTML element that triggered the reflex
  #   - params - parameters from the element's closest form (if any)
  #
  # Example:
  #
  #   def example(argument=true)
  #     # Your logic here...
  #     # Any declared instance variables will be made available to the Rails controller and view.
  #   end
  #
  # Learn more at: https://docs.stimulusreflex.com

  def complete
    morph :nothing
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :complete
    if todo.complete
      cable_ready[TodoChannel].set_attribute(selector: "#todo-#{todo.id}", name: "checked", value: "true")
    else
      cable_ready[TodoChannel].remove_attribute(selector: "#todo-#{todo.id}", name: "checked")
    end
    cable_ready.broadcast_to(todo)
  end

  def rename
    morph :nothing
    todo = Todo.find(element.dataset["todo-id"])
    todo.title = element.value
    todo.save

    cable_ready[TodoChannel].set_value(selector: "#todo-title-#{todo.id}", value: todo.title)
    cable_ready.broadcast_to(todo)
  end
end
