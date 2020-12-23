class ListSet < ApplicationRecord
  belongs_to :user
  has_many :lists
end
