class List < ApplicationRecord
  has_many :todos

  def name
    if date == nil
      return title
    end

    date.to_s + " Plan"
  end
end
