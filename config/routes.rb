Rails.application.routes.draw do
  resources :lists, only: [:show, :destroy] do
    post 'current', on: :new
  end

  devise_for :users

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "application#index"
end
