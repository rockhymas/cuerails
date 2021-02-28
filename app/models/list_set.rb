class ListSet < ApplicationRecord
  belongs_to :user
  has_many :lists, -> { order(position: :asc) }, dependent: :destroy

  def ordered_lists
    self.lists
  end
end
