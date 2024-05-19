Redmine::Plugin.register :ticket_calendar do
  name 'Ticket Calendar plugin'
  author 'Author name'
  description 'This plugin displays tickets in a calendar view with drag-and-drop functionality.'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'

  permission :view_ticket_calendar, { ticket_calendars: [:index, :update_dates, :update_done_ratio] }, public: true
  menu :project_menu, :ticket_calendar, { controller: 'ticket_calendars', action: 'index' }, caption: 'Calendar', after: :activity, param: :project_id
end
