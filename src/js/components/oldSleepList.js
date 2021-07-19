function SleepItem(props) {
  return (
    <li className="list-group-item">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-2">Sleep #{props.number}</h5>
        <small>{props.sleep.duration} mins</small>
      </div>
      <p className="mb-1">Asleep time: {props.sleep.asleepTime} <DangerText>(+5 min)</DangerText></p>
      <p className="mb-1">Awake time: {props.sleep.awakeTime} <DangerText>(+5 min)</DangerText></p>
    </li>
  );
}

function DayCard(props) {
  const day = props.day;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{day.title}, {day.dayOfWeek}</h5>
        <h6 className="card-subtitle text-muted">Awake time – {day.awakeTime}</h6>
      </div>

      <ul className="list-group list-group-flush">
        {day.dayPeriods.map((dayPeriod, i) => <SleepItem sleep={dayPeriod} key={i} number={i + 1} />)}
      </ul>

      <div className="card-footer text-muted">
        Wake time – {day.wakeTime.actual}, Sleep time – {day.sleepTime.actual}
      </div>
    </div>
  );
}

function SleepList() {
  return (
    <div>
      {model.days.map((day, i) => <DayCard day={day} key={i} />)}
    </div>
  );
}