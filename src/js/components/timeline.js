const timelineMainBg = "bg-primary";
const timelineDisabledBg = "bg-secondary";

function TimelineDot() {
  return (
    <div style={{ height: "0px", position: "relative", top: "-6px" }}>
      <div
        className={`rounded-circle ${timelineMainBg}`}

        style={{ margin: "0 auto", width: "12px", height: "12px" }}></div>
    </div>
  );
}

function TimelineLine(props) {
  return (
    <div
      className={`flex-grow-1 ${props.isActive ? timelineMainBg : timelineDisabledBg}`}
      style={{ margin: "0 auto", width: "4px", height: "100%" }}>
    </div>
  );
}

function TimelineSection(props) {
  const sectionHeight = props.isEnd ? "5px" : props.isActive ? "70px" : "60px";
  return (
    <div className="d-flex align-items-start align-items-stretch">
      <div
        className=""
        style={{ position: "relative", height: sectionHeight, width: "90px", textAlign: "right" }}>
        <div className="small overflow-visible text-nowrap position-absolute w-100" style={{ top: "-12px" }}>{props.leftDotText}</div>
        <div className="small overflow-visible text-nowrap position-absolute top-50 w-100" style={{ height: "26px", marginTop: "-13px" }}>{props.leftText}</div>
      </div>
      <div className="d-flex flex-column" style={{ width: "30px" }}>
        <TimelineDot />
        {
          !props.isEnd &&
          <TimelineLine isActive={props.isActive} />
        }
      </div>
      <div
        style={{ position: "relative", height: sectionHeight }}>
        <div className="small overflow-visible text-nowrap position-absolute" style={{ top: "-12px" }}>{props.rightDotText}</div>
        <div className="small overflow-visible text-nowrap position-absolute top-50" style={{ height: props.isEnd ? "0px" : "26px", marginTop: "-13px" }}>{props.rightText}</div>
      </div>
    </div>
  );
}

function TimelineSleepItem(props) {
  const period = props.dayPeriod || {};
  const plan = (props.dayPeriod && props.dayPeriod.plan) || {};
  const actual = (props.dayPeriod && props.dayPeriod.actual) || {};
  const lastItem = period.lastSleep;

  return (
    <React.Fragment>
      <TimelineSection
        key={1}
        isActive={false}
        leftDotText={plan.awakeTime}
        rightDotText={actual.awakeTime} />

      <TimelineSection
        key={2}
        isActive={true}
        leftText={!lastItem && plan.duration && (<small className="text-muted">{plan.duration} mins</small>)}
        rightText={!lastItem && actual.duration && (<small className="text-muted">{actual.duration} mins</small>)}
        leftDotText={plan.asleepTime}
        rightDotText={actual.asleepTime && <span>{actual.asleepTime} {actual.difference && <DangerText>(+{actual.difference} min)</DangerText>}</span>}
        isEnd={lastItem} />

    </React.Fragment>
  );
}

function DayTimeline(props) {
  const day = props.day || {};
  const periods = day.dayPeriods || [];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{day.title}, {day.dayOfWeek}</h5>
        <h6 className="card-subtitle text-muted">Awake time – {day.awakeTime}</h6>
      </div>

      <div className="mt-3 mb-4">
        {
          periods.map((dayPeriod, i) => <TimelineSleepItem dayPeriod={dayPeriod} awakeTime={day.awakeTime} key={i} number={i + 1} />)
        }
      </div>

      {/* <ul className="list-group list-group-flush">
          {day.sleeps.map((sleep, i) => <SleepItem sleep={sleep} key={i} number={i + 1} />)}
        </ul> */}

      <div className="card-footer text-muted">
        Wake time – {day.wakeTime && day.wakeTime.actual}, Sleep time – {day.sleepTime && day.sleepTime.actual || "?"}
      </div>
    </div>
  );
}

function TimelineSleepList(props) {
  const days = props.days || [];

  return (
    <div>
      {days.map((day, i) => <DayTimeline day={day} key={i} />)}
    </div>
  );
}
