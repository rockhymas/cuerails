json.extract! todo, :id, :title, :status, :pinned, :list_id, :created_at, :updated_at
json.url todo_url(todo, format: :json)
