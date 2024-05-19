# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  # plugins/ticket_calendar/config/routes.rb
  resources :projects do
    resources :ticket_calendars, only: [:index] do
      member do
        put :update_dates
        put :update_done_ratio
      end
    end
  end
end
