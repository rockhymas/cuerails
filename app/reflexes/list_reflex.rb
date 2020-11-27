# frozen_string_literal: true

class ListReflex < ApplicationReflex
  include CableReady::Broadcaster
  delegate :render, to: ApplicationController

  def rename
    list = List.find(element.dataset["list-id"])
    list.title = element.dataset["value"]
    list.save

    # morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def forceUpdate
    list = List.find(element.dataset["list-id"])
    # morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def insertTodo
    position = 0
    list = List.find(element.dataset["list-id"])

    new_todo = Todo.create(list: list, position: position)
    new_todo.save

    morph :nothing
    cable_ready[ListChannel].insert_adjacent_html(selector: "#list-title-#{list.id}", position: :afterend, html: render(partial: "todos/entry", locals: { todo: new_todo }))
    cable_ready.broadcast_to(list)
  end

end