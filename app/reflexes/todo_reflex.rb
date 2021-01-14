# frozen_string_literal: true

class TodoReflex < ApplicationReflex

  def complete
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :complete

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: "#todo-row-#{todo.id}", html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true)
      .broadcast_to(todo.list)
  end

  def togglePin
    todo = Todo.find(element.dataset["todo-id"])
    todo.toggle! :pinned

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: "#todo-options-#{todo.id}", html: render(partial: "todos/options", locals: { todo: todo }), children_only: true)
      .broadcast_to(todo.list)
  end

  def rename
    todo = Todo.find(element.dataset["todo-id"])
    todo.title = element.value
    todo.save

    morph :nothing
    cable_ready[ListChannel]
      .dispatch_event(name: "rename", selector: "#todo-row-#{todo.id}", detail: { title: todo.title, initiator: element.dataset["initiator"]})
      .broadcast_to(todo.list)
  end

  def forceUpdate
    todo = Todo.find(element.dataset["todo-id"])
    morph "#todo-row-#{todo.id}", render(partial: "todos/entry", locals: { todo: todo })
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
        .morph(selector: "#todo-row-#{todo.id}", html: render(partial: "todos/entry_contents", locals: { todo: todo }), children_only: true)
        .broadcast_to(todo.list)
      return
    end

    todo.destroy
    
    morph :nothing
    cable_ready[ListChannel]
      .dispatch_event(name: 'deleteTodo', selector: "#todo-row-#{todoId}")
      .broadcast_to(list)
  end

end
