Rails.application.routes.draw do
  resources :todos
  resources :lists
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "application#index"
end
