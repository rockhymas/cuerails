class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :lists
  has_many :list_sets
  belongs_to :plan_list, class_name: "List", optional: true
  belongs_to :plan_list_set, class_name: "ListSet", optional: true
  belongs_to :current_list_set, class_name: "ListSet", optional: true
  belongs_to :archive_list_set, class_name: "ListSet", optional: true

  def current_day_plan
    self.plan_list_set.lists.where("date <= :today", {today: today}).first
  end

  def ensure_list_sets
    if plan_list_set.nil?
      self.plan_list_set = ListSet.create(user: self, user_managed: false)
      self.save
    end

    if archive_list_set.nil?
      self.archive_list_set = ListSet.create(user: self, user_managed: true)
      self.save
    end

    self.lists.where(list_set_id: nil).each do |list|
      list.list_set_id = self.archive_list_set.id
      list.save
    end

    if plan_list_set.lists.empty?
      today_plan = List.create(list_set: plan_list_set, user: self, date: today - 1)
      # TODO: fill today plan with instructions, rename it as instructions, walk people through initial planning
    end

    if current_list_set.nil?
      self.current_list_set = ListSet.create(user: self, user_managed: true)
      self.save
    end
  end

  def can_plan_day?
    plan_list.nil? && plan_list_set.lists.last.date <= today
  end

  def start_planning_next_day
    if plan_list.present?
      # Already in planning mode
      return
    end

    # day to plan is the day after last day planned, or today, whichever is later
    latest_day_planned = plan_list_set.lists.last.date
    day_to_plan = latest_day_planned + 1
    if (day_to_plan <=> today) == -1
      day_to_plan = today
    end

    day_to_plan_list = List.create(list_set: plan_list_set, user: self, date: day_to_plan)
    self.plan_list = day_to_plan_list
    self.save
  end

  def stop_planning
    if self.plan_list.nil?
      # Can't stop, not currently planning
      return
    end

    self.plan_list = nil
    self.save

    self.plan_list_set.lists.where("date < :today", {today: today}).limit(1).each do |list|
      list.list_set = self.archive_list_set
      list.save
    end
  end

  def today
    zone = ActiveSupport::TimeZone.new(time_zone)
    zone.now.to_date
  end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(self.email.downcase)
    "https://secure.gravatar.com/avatar/#{gravatar_id}"
  end
end
