class ApplicationController < ActionController::Base
  include CableReady::Broadcaster

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  def plan_next_day
    current_user.start_planning_next_day

    PlanJob.perform_later current_user.id

    redirect_to root_path
  end

  def complete_plan
    current_user.stop_planning

    PlanJob.perform_later current_user.id

    redirect_to root_path
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:time_zone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:time_zone])
  end
end
