class List < ApplicationRecord
  has_many :todos, -> { order(position: :asc) }, dependent: :destroy
  belongs_to :user
  belongs_to :list_set, optional: true
  acts_as_list scope: :list_set

  before_create :ensure_single_todo

  scope :rotate_past, ->(index) { reorder(Arel.sql("mod(position + 6 - %d, 7)" % [index + 1])) }

  def name
    if is_name_editable?
      if title == nil || title == ''
        return 'Untitled'
      end
      return title
    end

    today = user.today

    if date == today
      return "Today's Plan"
    elsif date == today - 1
      return "Yesterday's Plan"
    elsif date == today + 1
      return "Tomorrow's Plan"
    end

    date.strftime('%m/%d/%Y') + " Plan"
  end

  def editable_name
    if is_name_editable?
      return title
    end

    return nil
  end

  def is_name_editable?
    date.blank?
  end

  def ensure_single_todo
    if self.todos.length == 0
      self.todos << Todo.create
      ListUpdateJob.perform_later self.id
    end
  end

end
