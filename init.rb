Redmine::Plugin.register :ticket_calendar do
  name 'Ticket Calendar plugin'
  author 'tiohsa'
  description 'This plugin displays tickets in a calendar view with drag-and-drop functionality.'
  version '0.0.1'
  url 'https://github.com/tiohsa/ticket_calendar'
  author_url 'https://github.com/tiohsa'

  permission :view_ticket_calendar, { ticket_calendars: [:index, :update_dates] }, public: true
  menu :project_menu, :ticket_calendar, { controller: 'ticket_calendars', action: 'index' }, caption: 'Calendar', after: :activity, param: :project_id
end
