class ListsController < ApplicationController
  before_action :set_list, only: [:show, :destroy]

  def index
    current_user.ensure_list_sets
  end

  def show
  end

  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to lists_url, notice: 'List was successfully destroyed.' }
    end
  end

  def new_current
    new_list = List.create(list_set: current_user.current_list_set, user: current_user)
    redirect_to new_list
  end

  def current
    current_user.ensure_list_sets
    @list = current_user.current_day_plan
    render 'show'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_list
      @list = List.find(params[:id])
    end
end
