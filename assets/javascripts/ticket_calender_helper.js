class TicketCalenderHelper {
  // フェッチのレスポンスをチェックし、エラーメッセージを処理する
  checkResponse(response) {
    if (!response.ok) {
      return response.json().then((error) => {
        let errorMessage = error.message || "Unknown error occurred.";
        if (error.errors) {
          errorMessage += "\n" + error.errors.join("\n");
        }
        throw new Error(errorMessage);
      });
    } else {
      return response.json();
    }
  }

  addDay(date, days) {
    return new Date(date.getTime() + 1000 * 60 * 60 * 24 * days);
  }

  getTasks(project_id, params, successCallback, failureCallback) {
    fetch(`/projects/${project_id}/ticket_calendars?${params}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((events) => successCallback(events))
      .catch((error) => failureCallback(error));
  }

  updateTicketDates(
    project_id,
    ticket_id,
    start_date,
    end_date,
    successCallback,
    failureCallback,
  ) {
    fetch(
      `/projects/${project_id}/ticket_calendars/${ticket_id}/update_dates`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
        body: JSON.stringify({
          issue: {
            start_date: start_date,
            due_date: end_date,
          },
        }),
      },
    )
      .then((response) => this.checkResponse(response))
      .then((data) => successCallback(data))
      .catch((error) => failureCallback(error));
  }
}
