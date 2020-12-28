# frozen_string_literal: true

class ListSetReflex < ApplicationReflex

  def positionItem(new_index)
    list = List.find(element.dataset["list-id"])
    list.position = new_index + 1
    list.save

    morph :nothing
    cable_ready[ListSetChannel]
      .morph(selector: "#list-set-contents-#{list.list_set.id}", html: render(partial: "list_sets/pane", locals: { list_set: list.list_set }), children_only: true)
      .broadcast_to(list.list_set)
end

end