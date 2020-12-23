class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  def index
    current_user.ensure_plan_list
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:time_zone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:time_zone])
  end
end
