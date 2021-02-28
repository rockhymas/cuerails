class PlanListSet < ListSet
  after_create :create_lists

  def create_lists
    List.create(list_set: self, user: self.user, date: self.user.today - 1)
    # TODO: fill today plan with instructions, rename it as instructions, walk people through initial planning
  end
end
