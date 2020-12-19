# frozen_string_literal: true

class ListReflex < ApplicationReflex
  def rename
    list = List.find(element.dataset["list-id"])
    list.title = element.value
    list.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: "#list-panel-#{list.id}", html: render(partial: "lists/panel", locals: { list: list }), children_only: true)
      .broadcast_to(list)
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

  def cloneTo(todo_id, new_index)
    todo = Todo.find(todo_id)
    old_list = todo.list
    list = List.find(element.dataset["list-id"])

    new_todo = Todo.create(list_id: list.id, title: todo.title, position: new_index + 1)
    new_todo.save

    todoPinned = todo.pinned
    if !todoPinned
      todo.destroy
    end

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: "#list-panel-#{list.id}", html: render(partial: "lists/panel", locals: { list: list }), children_only: true)
      .broadcast_to(list)
    if !todoPinned
      cable_ready[ListChannel]
        .dispatch_event(name: 'deleteTodo', selector: "#todo-row-#{todo_id}")
        .broadcast_to(old_list)
    end
  end

end