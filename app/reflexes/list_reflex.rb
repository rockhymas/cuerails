# frozen_string_literal: true

class ListReflex < ApplicationReflex

  def rename
    list = List.find(element.dataset["list-id"])
    list.title = element.value
    list.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(list), html: render(partial: "lists/panel_contents", locals: { list: list }), children_only: true)
      .broadcast_to(list)

    if list.list_set.present?
      cable_ready[ListSetChannel]
        .morph(selector: dom_id(list.list_set), html: render(partial: "list_sets/items", locals: { list_set: list.list_set }), children_only: true)
        .broadcast_to(list.list_set)
    end
  end

  def forceUpdate
    list = List.find(element.dataset["list-id"])
  end

  def insertTodo
    position = 0
    list = List.find(element.dataset["list-id"])
    todo = nil
    if element.dataset["todo-id"]
      todo = Todo.find(element.dataset["todo-id"])
      position = todo.position + 1
    end

    new_todo = Todo.create(list: list, position: position)
    new_todo.save

    morph :nothing
    if todo.present?
      cable_ready[ListChannel]
        .insert_adjacent_html(selector: dom_id(todo), position: :afterend, html: render(partial: "todos/entry", locals: { todo: new_todo }))
        .broadcast_to(list)
    else
      cable_ready[ListChannel]
        .insert_adjacent_html(selector: dom_id(list, 'items'), position: :afterbegin, html: render(partial: "todos/entry", locals: { todo: new_todo }))
        .broadcast_to(list)
    end
  end

  def newTodo(uuid, after_todo_id)
    position = 0
    if (after_todo_id != -1)
      position = Todo.find(after_todo_id).position + 1
    end
    list = List.find(element.dataset["list-id"])

    new_todo = Todo.create(list: list, position: position)
    morph "#a#{uuid}", render(partial: "todos/entry", locals: { todo: new_todo })
  end

  def positionItem(new_index)
    todo = Todo.find(element.dataset["todo-id"])
    todo.position = new_index + 1
    todo.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo.list), html: render(partial: "lists/panel_contents", locals: { list: todo.list }), children_only: true)
      .broadcast_to(todo.list)
  end

  def cloneTo(new_index)
    todo_id = element.dataset["todo-id"]
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
      .morph(selector: dom_id(list), html: render(partial: "lists/panel_contents", locals: { list: list }), children_only: true)
      .broadcast_to(list)
    if !todoPinned
      cable_ready[ListChannel]
        .dispatch_event(name: 'deleteTodo', selector: dom_id(todo))
        .broadcast_to(old_list)
    end
  end

end