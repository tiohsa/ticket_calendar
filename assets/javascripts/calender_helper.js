class CalendarHelper {
  constructor(options) {
    this.ticketCalenderHelper = new TicketCalenderHelper();
    this.project_id = options.project_id;
    this.milestoneCheckbox = document.getElementById(options.milestoneCheckbox);
    this.statusCheckboxes = document.querySelectorAll(options.statusCheckboxes);
    this.calendarEl = document.getElementById(options.calendar);
    this.selectView = document.getElementById("view-selector");

    this.initial();
    this.attachSelectViewEvent();
    this.attachStatusFilterEvent();
    this.attachMilestoneFilterEvent();
  }

  initial() {
    this.calendar = new FullCalendar.Calendar(this.calendarEl, {
      initialView: "multiMonthYear",
      timeZone: "local",
      firstDay: 1,
      events: this.getTasks.bind(this),
      editable: true,
      eventDrop: (info) => {
        this.updateTicketDatesHandler(this.project_id, info);
      },
      eventResizableFromStart: true,
      eventResize: (info) => {
        this.updateTicketDatesHandler(this.project_id, info);
      },
    });

    this.calendar.render();
  }

  successCallback = (data) => {};

  failureCallback = (error) => {
    alert(error);
  };

  getTasks(fetchInfo, successCallback, failureCallback) {
    var params = Array.from(this.statusCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => `status_ids[]=${cb.value}`)
      .join("&");
    params += "&milestone_flag=" + this.milestoneCheckbox.checked;
    params += `&start=${fetchInfo.start.toLocaleDateString()}&end=${fetchInfo.end.toLocaleDateString()}`;
    this.ticketCalenderHelper.getTasks(
      this.project_id,
      params,
      successCallback,
      failureCallback,
    );
  }

  updateTicketDatesHandler(project_id, info) {
    var ticket_id = info.event.id;
    var newStartDate = info.event.start;
    var newEndDate = info.event.end ? info.event.end : newStartDate;
    this.ticketCalenderHelper.updateTicketDates(
      project_id,
      ticket_id,
      newStartDate,
      newEndDate,
      this.successCallback,
      this.failureCallback,
    );
  }

  attachSelectViewEvent() {
    this.selectView.addEventListener("change", () => {
      this.calendar.changeView(this.selectView.value);
    });
  }

  attachStatusFilterEvent() {
    this.statusCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.calendar.refetchEvents();
      });
    });
  }

  attachMilestoneFilterEvent() {
    this.milestoneCheckbox.addEventListener("change", () => {
      this.calendar.refetchEvents();
    });
  }
}
