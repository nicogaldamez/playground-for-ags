Rails.application.routes.draw do
  concern :edit_field do
    get ':field/edit', on: :member, action: :edit_field, as: :edit_field
  end

  resources :books, concerns: %i[edit_field]
  resources :messages, concerns: %i[edit_field] do
    get :list, on: :collection
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
