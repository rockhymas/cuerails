class ListsController < ApplicationController
  before_action :set_list, only: [:show, :destroy]

  def show
  end

  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to lists_url, notice: 'List was successfully destroyed.' }
    end
  end

  def current
    new_list = List.create(list_set: current_user.current_list_set, user: current_user)
    redirect_to new_list
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_list
      @list = List.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def list_params
      params.require(:list).permit(:title, :date)
    end
end
