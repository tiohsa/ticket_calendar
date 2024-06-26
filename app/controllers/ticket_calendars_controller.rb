require 'date'

class TicketCalendarsController < ApplicationController
  unloadable
  before_action :find_project, :authorize
  before_action :find_ticket, only: [:update_dates]

  def index
    start_date = params[:start] ? params[:start] : Date.today.beginning_of_month - 7
    end_date = params[:end] ? params[:end] : Date.today.end_of_month + 7
    if params[:milestone_flag] == 'true'
      tickets = @project.issues.where("start_date >= ? AND start_date <= ? AND status_id in (?) AND due_date is null", start_date, end_date, params[:status_ids]).order(start_date: :asc, id: :asc)
    else
      tickets = @project.issues.where("start_date >= ? AND start_date <= ? AND status_id in (?)", start_date, end_date, params[:status_ids]).order(start_date: :asc, id: :asc)
    end
    respond_to do |format|
      format.html
      format.json { render json: tickets.map { |ticket| ticket_to_calendar_json(ticket) } }
    end
  end

  def find_project
    @project = Project.find(params[:project_id])
  end

  def update_dates
    ticket = Issue.find(params[:id])
    start_date = Date.parse(issue_params[:start_date]) rescue nil
    due_date = Date.parse(issue_params[:due_date]) rescue nil

    if start_date.nil?
      render json: { status: 'error', message: 'Start date is not a valid date' }, status: :unprocessable_entity
      return
    end

    # fullcalendarから受ける日付は一日増やしたので戻す
    ticket.start_date = start_date
    if ticket.due_date
      ticket.due_date = due_date <= start_date ?  start_date  : due_date - 1
    end

    if ticket.save
      render json: { status: 'ok' }
    else
      render json: { status: 'error', message: ticket.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def ticket_to_calendar_json(ticket)
    {
      id: ticket.id,
      title: ticket.subject,
      start: ticket.start_date,
      end: ticket.due_date ? ticket.due_date + 1 : ticket.due_date, # fullcalendarでは2024/01/01 00:00から2024/01/02 00:00だと１日分を表すため+1日する
      url: issue_path(ticket),
      extendedProps: {
        milestone: ticket.due_date == nil
    }
    }
  end

  def find_ticket
    @ticket = @project.issues.find(params[:id])
  end


  def issue_params
    params.require(:issue).permit(:start_date, :due_date)
  end
end
