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

    lists.where("date <= :today", {today: today}).first
  end

  def ensure_list_sets
    if plan_list_set.nil?
      zone = ActiveSupport::TimeZone.new(time_zone)
      today = zone.now.to_date

      self.plan_list_set = ListSet.create(user: self, user_managed: false)
      today_plan = List.create(list_set: plan_list_set, user: self, date: today)
      # TODO: fill today plan with instructions, rename it as instructions, walk people through initial planning
      self.save
    end

    if current_list_set.nil?
      self.current_list_set = ListSet.create(user: self, user_managed: true)
      self.save
    end
  end
end
