class Todo < ApplicationRecord
  belongs_to :list
  acts_as_list scope: :list

  after_destroy do
    self.list.ensure_single_todo
  end
end
