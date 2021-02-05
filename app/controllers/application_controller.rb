class ApplicationController < ActionController::Base
  include CableReady::Broadcaster

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  def plan_next_day
    current_user.start_planning_next_day

    cable_ready[UserChannel]
      .morph(selector: "#plan_container", html: ApplicationController.render(partial: "lists/panel", locals: { list: current_user.plan_list }), children_only: true)
      .broadcast_to(current_user)

    cable_ready[ListSetChannel]
      .morph(selector: dom_id(current_user.plan_list_set, 'contents'), html: ApplicationController.render(partial: "list_sets/items", locals: { list_set: current_user.plan_list_set }), children_only: true)
      .broadcast_to(current_user.plan_list_set)

    redirect_to root_path
  end

  def complete_plan
    current_user.stop_planning

    cable_ready[UserChannel]
      .morph(selector: "#plan_container", html: '', children_only: true)
      .broadcast_to(current_user)

    cable_ready[ListSetChannel]
      .morph(selector: dom_id(current_user.plan_list_set, 'contents'), html: ApplicationController.render(partial: "list_sets/items", locals: { list_set: current_user.plan_list_set }), children_only: true)
      .broadcast_to(current_user.plan_list_set)

    redirect_to root_path
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:time_zone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:time_zone])
  end
end
