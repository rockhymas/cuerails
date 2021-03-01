class ListUpdateJob < ApplicationJob
  include CableReady::Broadcaster
  queue_as :default

  def perform(list_id)
    list = List.find(list_id)

    cable_ready[ListChannel]
      .morph(selector: dom_id(list), html: render(partial: "lists/panel_contents", locals: { list: list }), children_only: true)
      .broadcast_to(list)
  end
end