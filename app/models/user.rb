class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :lists
  belongs_to :plan_list, class_name: "List"

  def current_day_plan
    zone = ActiveSupport::TimeZone.new(time_zone)
    today = zone.now.to_date

    lists.where("date <= :today", {today: today}).first
  end
end
