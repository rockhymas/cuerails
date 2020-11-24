# frozen_string_literal: true

class ListReflex < ApplicationReflex
  include CableReady::Broadcaster
  delegate :render, to: ApplicationController

  def rename
    list = List.find(element.dataset["list-id"])
    puts element
    list.title = element.dataset["value"]
    list.save

#    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

  def forceUpdate
    list = List.find(element.dataset["list-id"])
    # morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
  end

end