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

  def current_day_plan
    zone = ActiveSupport::TimeZone.new(time_zone)
    today = zone.now.to_date

    self.plan_list_set.lists.where("date <= :today", {today: today}).first
  end

  def ensure_list_sets
    if plan_list_set.nil?
      self.plan_list_set = ListSet.create(user: self, user_managed: false)
      self.save
    end

    if plan_list_set.lists.empty?
      zone = ActiveSupport::TimeZone.new(time_zone)
      today = zone.now.to_date
      today_plan = List.create(list_set: plan_list_set, user: self, date: today)
      # TODO: fill today plan with instructions, rename it as instructions, walk people through initial planning
    end

    if current_list_set.nil?
      self.current_list_set = ListSet.create(user: self, user_managed: true)
      self.save
    end
  end

  def can_plan_day?
    zone = ActiveSupport::TimeZone.new(time_zone)
    today = zone.now.to_date

    plan_list.nil? && plan_list_set.lists.last.date <= today
  end

  def start_planning_next_day
    if plan_list.present?
      # Already in planning mode
      return
    end

    zone = ActiveSupport::TimeZone.new(time_zone)
    today = zone.now.to_date
    latest_day_planned = plan_list_set.lists.last.date
    day_to_plan = latest_day_planned + 1
    if (day_to_plan <=> today) == -1
      day_to_plan = today
    end

    day_to_plan_list = List.create(list_set: plan_list_set, user: self, date: day_to_plan)
    self.plan_list = day_to_plan_list
    self.save

    # TODO: cable ready updates to all clients
    # TODO: we'll need a planning channel that can update the plan list div
    # TODO: also update the plan list set through the list set channel
  end

  def stop_planning
    if self.plan_list.nil?
      # Can't stop, not currently planning
      return
    end

    zone = ActiveSupport::TimeZone.new(time_zone)
    today = zone.now.to_date
    self.plan_list_set.lists.where("date < :today", {today: today}).limit(1).each do |list|
      self.plan_list_set.lists.delete(list)
    end

    self.plan_list = nil
    self.save
    # TODO: cable ready updates to all clients
    # TODO: we'll need a planning channel that can update the plan list div
    # TODO: also update the plan list set through the list set channel
  end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(self.email.downcase)
    "https://secure.gravatar.com/avatar/#{gravatar_id}"
  end
end
