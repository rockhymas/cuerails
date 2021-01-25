# frozen_string_literal: true

class TodoReflex < ApplicationReflex

  def complete
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :complete

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(todo.list)
  end

  def togglePin
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :pinned

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo, "options"), html: render(partial: "todos/options", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
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

  def delete
    todoId = element.dataset["todo-id"]
    todo = Todo.find(todoId)
    list = todo.list

    todo_selector = dom_id(todo)
    todo.destroy

    # TODO: run a check on the list? that will create a new one. Newly created todos update via CR like any other newly created todo

    morph :nothing
    cable_ready[ListChannel]
      .remove(selector: todo_selector, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(list)
  end

end
