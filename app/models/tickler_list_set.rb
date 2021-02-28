class TicklerListSet < ListSet
  after_create :create_lists

  def create_lists
    lists.create!(list_set: self, user: self.user, title: "Sunday")
    lists.create!(list_set: self, user: self.user, title: "Monday")
    lists.create!(list_set: self, user: self.user, title: "Tuesday")
    lists.create!(list_set: self, user: self.user, title: "Wednesday")
    lists.create!(list_set: self, user: self.user, title: "Thursday")
    lists.create!(list_set: self, user: self.user, title: "Friday")
    lists.create!(list_set: self, user: self.user, title: "Saturday")
  end

  def ordered_lists
    index = self.user.plan_list_set.lists.where.not(id: self.user.plan_list_id).last.date.wday
    lists.rotate_past(index)
  end

end
