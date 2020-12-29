Rails.application.routes.draw do
  resources :lists, only: [:show, :destroy] do
    post 'current', on: :new
  end

  devise_for :users

  post 'plan', to: 'application#plan_next_day', as: :plan_next_day
  post 'complete_plan', to: 'application#complete_plan', as: :complete_plan

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "lists#index"
end
