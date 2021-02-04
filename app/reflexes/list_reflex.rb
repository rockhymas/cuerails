# frozen_string_literal: true

class ListReflex < ApplicationReflex

  def rename
    list = List.find(element.dataset["list-id"])
    list.title = element.value
    list.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(list, 'header'), html: render(partial: "lists/panel_header", locals: { list: list }), children_only: true, exemptId: element.dataset["crap-id-value"])
      .broadcast_to(list)

    if list.list_set.present?
      cable_ready[ListSetChannel]
        .morph(selector: dom_id(list.list_set, 'contents'), html: render(partial: "list_sets/items", locals: { list_set: list.list_set }), children_only: true)
        .broadcast_to(list.list_set)
    end
  end

  def newTodo(uuid, after_todo_id, clone_todo_id)
    position = 0
    prev_todo = nil
    if (after_todo_id != -1)
      prev_todo = Todo.find(after_todo_id)
      position = prev_todo.position + 1
    end
    list = List.find(element.dataset["list-id"])
    clone_todo = nil
    if clone_todo_id.present?
      clone_todo = Todo.find(clone_todo_id)
    end

    new_todo = Todo.create(list: list, position: position, title: clone_todo.present? ? clone_todo.title : '')
    morph "#a#{uuid}", render(partial: "todos/entry", locals: { todo: new_todo })

    if prev_todo.present?
      cable_ready[ListChannel]
        .insert_adjacent_html(selector: dom_id(prev_todo), position: :afterend, html: render(partial: "todos/entry", locals: { todo: new_todo }), exemptId: element.dataset["crap-id-value"])
        .broadcast_to(list)
    else
      cable_ready[ListChannel]
        .insert_adjacent_html(selector: dom_id(list, 'items'), position: :afterbegin, html: render(partial: "todos/entry", locals: { todo: new_todo }), exemptId: element.dataset["crap-id-value"])
        .broadcast_to(list)
    end

    if clone_todo.present?
      if !clone_todo.pinned
        cable_ready[ListChannel]
          .remove(selector: dom_id(clone_todo), exemptId: element.dataset["crap-id-value"])
          .broadcast_to(clone_todo.list)
        clone_todo.destroy
      end
    end
  end

  def positionItem(new_index)
    todo = Todo.find(element.dataset["todo-id-value"])
    todo.position = new_index + 1
    todo.save

    morph :nothing
    cable_ready[ListChannel]
      .morph(selector: dom_id(todo.list), html: render(partial: "lists/panel_contents", locals: { list: todo.list }), children_only: true)
      .broadcast_to(todo.list)
  end

end