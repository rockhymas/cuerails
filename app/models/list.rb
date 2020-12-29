class List < ApplicationRecord
  has_many :todos, -> { order(position: :asc) }
  belongs_to :user
  belongs_to :list_set, optional: true
  acts_as_list scope: :list_set

  def name
    if is_name_editable?
      if title == nil || title == ''
        return 'Untitled'
      end
      return title
    end

    zone = ActiveSupport::TimeZone.new(user.time_zone)
    today = zone.now.to_date

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

  before_create do
    if self.todos.length == 0
      self.todos << Todo.create
    end
  end
end
