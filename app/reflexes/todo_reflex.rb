# frozen_string_literal: true

class TodoReflex < ApplicationReflex
  include CableReady::Broadcaster
  delegate :render, to: ApplicationController

  def complete
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :complete

    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def togglePin
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :pinned

    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def rename
    todo = Todo.find(element.dataset["todo-id"])
    todo.title = element.value
    todo.save

    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def forceUpdate
    todo = Todo.find(element.dataset["todo-id"])
    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def delete
    todo = Todo.find(element.dataset["todo-id"])
    todo.destroy
    
    morph :nothing
  end

  def cloneTo(new_list, new_index)
    todo = Todo.find(element.dataset["todo-id"])
    list = List.find(new_list)

    new_todo = Todo.create(list: list, title: todo.title, position: new_index + 1)
    new_todo.save

    cable_ready[ListChannel].remove(selector: "#todo-row-added")
    cable_ready.broadcast_to(todo.list)

    # morph "#todo-row-added", render(partial: "todos/entry", locals: { todo: new_todo })
  end

  def reposition(new_index)
    todo = Todo.find(element.dataset["todo-id"])
    todo.position = new_index + 1
    todo.save

    morph "#list-panel-#{todo.list.id}", render(partial: "lists/panel", locals: { list: todo.list })
  end

  def insertAfter
    todo = Todo.find(element.dataset["todo-id"])

    new_todo = Todo.create(list: todo.list, position: todo.position + 1)
    new_todo.save

    morph :nothing
    cable_ready[ListChannel].insert_adjacent_html(selector: "#todo-row-#{todo.id}", position: :afterend, html: render(partial: "todos/entry", locals: { todo: new_todo }))
    cable_ready.broadcast_to(todo.list)
  end

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
end
