# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  # plugins/ticket_calendar/config/routes.rb
  resources :projects do
    resources :ticket_calendars, only: [:index] do
      member do
        put :update_dates
      end
    end
  end
end
