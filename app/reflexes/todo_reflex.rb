# frozen_string_literal: true

class TodoReflex < ApplicationReflex

  def complete
    todo = Todo.find(element.dataset["todo-id-value"])
    todo.toggle! :complete

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(todo.list)
  end

  def togglePin
    todo = Todo.find(element.dataset["todo-id-value"])
    todo.toggle! :pinned

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(todo.list)
  end

  def rename
    todo = Todo.find(element.dataset["todo-id-value"])
    todo.title = element.value
    todo.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo), html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(todo.list)
  end

  def delete
    todo = Todo.find(element.dataset["todo-id-value"])

    list = todo.list
    todo_selector = dom_id(todo)

    todo.destroy

    morph :nothing
    cable_ready[ListChannel]
      .remove(selector: todo_selector, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(list)
  end

end
