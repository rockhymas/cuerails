class PlanJob < ApplicationJob
  include CableReady::Broadcaster
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)

    cable_ready[UserChannel]
      .morph(selector: "#plan_container", html: user.plan_list ? render(partial: "lists/panel", locals: { list: user.plan_list }) : '', children_only: true)
      .broadcast_to(user)

    cable_ready[ListSetChannel]
      .morph(selector: dom_id(user.plan_list_set), html: render(partial: "list_sets/plan_set", locals: { user: user }))
      .broadcast_to(user.plan_list_set)

    cable_ready[ListSetChannel]
      .morph(selector: dom_id(user.daily_tickler_list_set), html: render(partial: "list_sets/daily_tickler_set", locals: { user: user }))
      .broadcast_to(user.daily_tickler_list_set)

    cable_ready[ListSetChannel]
      .morph(selector: dom_id(user.archive_list_set), html: render(partial: "list_sets/archive_set", locals: { user: user }))
      .broadcast_to(user.archive_list_set)

  end
end