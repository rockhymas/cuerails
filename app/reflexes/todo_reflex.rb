# frozen_string_literal: true

class TodoReflex < ApplicationReflex

  def complete
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :complete

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true)
      .broadcast_to(todo.list)
  end

  def togglePin
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :pinned

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo, "options"), html: render(partial: "todos/options", locals: { todo: todo }), children_only: true)
      .broadcast_to(todo.list)
  end

  def rename
    todo = Todo.find(element.dataset["todo-id"])
    todo.title = element.value
    todo.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(todo.list)
  end

  def creationComplete
    todo = Todo.find(element.dataset["todo-id"])
    prev_todo = todo.higher_item
    morph :nothing
    if prev_todo.present?
      cable_ready[ListChannel]
        .insert_adjacent_html(selector: dom_id(prev_todo), position: :afterend, html: render(partial: "todos/entry", locals: { todo: todo }), exemptId: element.dataset["crap-id-value"])
        .broadcast_to(todo.list)
    end
  end

  def forceUpdate
    todo = Todo.find(element.dataset["todo-id"])
    morph dom_id(todo), render(partial: "todos/entry", locals: { todo: todo })
  end

  def delete
    todoId = element.dataset["todo-id"]
    todo = Todo.find(todoId)
    list = todo.list

    if list.todos.length == 1
      todo.title = ''
      todo.save
      morph :nothing
      cable_ready[ListChannel]
        .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true)
        .broadcast_to(todo.list)
      return
    end

    todo.destroy
    
    morph :nothing
    cable_ready[ListChannel]
      .dispatch_event(name: 'deleteTodo', selector: dom_id(todo))
      .broadcast_to(list)
  end

end
