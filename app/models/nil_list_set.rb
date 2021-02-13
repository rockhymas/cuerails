class NilListSet
  def initialize(user)
    @user = user
  end

  def user
    @user
  end

  def lists
    @user.lists.where(list_set_id: nil)
  end

  def id
    nil
  end

  def to_key
    [id]
  end

  def model_name
    ActiveModel::Name.new(ListSet)
  end

  def user_managed
    true
  end
end
