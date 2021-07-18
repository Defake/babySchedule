"use strict";

const e = React.createElement;
const useState = React.useState;

var model = {
  days: [
    {
      title: "14 July",
      dayOfWeek: "Wednesday",
      awakeTime: "06:50",
      sleepTime: {
        plan: "04:10",
        actual: "04:10",
      },
      wakeTime: {
        plan: "10:55",
        actual: "10:55",
      },
      dayPeriods: [
        {
          plan: {
            awakeTime: "06:50",
            asleepTime: "09:05",
            duration: 60,
          },
          actual: {
            awakeTime: "06:50",
            asleepTime: "09:10",
            difference: 5,
            duration: 60,
          }
        },
        {
          plan: {
            awakeTime: "10:10",
            asleepTime: "12:55",
            duration: 120,
          },
          actual: {
            awakeTime: "10:10",
            asleepTime: "13:00",
            duration: 120,
            difference: 5,
          }
        },
        {
          lastSleep: true,
          plan: {
            awakeTime: "14:10",
            asleepTime: "17:00",
          },
          actual: {
            awakeTime: "14:10",
          }
        }
      ]
    }
  ],
};

function ConfirmButton() {
  const [state, setState] = useState({ confirmed: false });

  if (state.confirmed) {
    return "OK.";
  }

  return (
    <button
      type="button"
      className="btn btn-primary mt-3"
      onClick={() => setState({ confirmed: true })}
    >
      Apply
    </button>
  );
}

function DangerText(props) {
  return (
    <span className="text-danger">{props.children}</span>
  );
}

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
        <div className="overflow-visible text-nowrap position-absolute w-100" style={{ top: "-13px" }}>{props.leftDotText}</div>
        <div className="overflow-visible text-nowrap position-absolute top-50 w-100" style={{ height: "26px", marginTop: "-13px" }}>{props.leftText}</div>
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
        <div className="overflow-visible text-nowrap position-absolute" style={{ top: "-13px" }}>{props.rightDotText}</div>
        <div className="overflow-visible text-nowrap position-absolute top-50" style={{ height: props.isEnd ? "0px" : "26px", marginTop: "-13px" }}>{props.rightText}</div>
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
  const day = props.day;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{day.title}, {day.dayOfWeek}</h5>
        <h6 className="card-subtitle text-muted">Awake time – {day.awakeTime}</h6>
      </div>

      <div className="mt-3 mb-4">
        {
          day.dayPeriods.map((dayPeriod, i) => <TimelineSleepItem dayPeriod={dayPeriod} awakeTime={day.awakeTime} key={i} number={i + 1} />)
        }
      </div>

      {/* <ul className="list-group list-group-flush">
        {day.sleeps.map((sleep, i) => <SleepItem sleep={sleep} key={i} number={i + 1} />)}
      </ul> */}

      <div className="card-footer text-muted">
        Wake time – {day.wakeTime.actual}, Sleep time – {day.sleepTime.actual || "?"}
      </div>
    </div>
  );
}

function AlternativeSleepList() {
  return (
    <div>
      {model.days.map((day, i) => <DayTimeline day={day} key={i} />)}
    </div>
  );
}

function MainContainer(props) {
  return (
    <div style={{ width: "600px" }} className="mt-3">
      {props.children}
    </div>
  );
}

function Application() {
  return (
    <div style={{ marginTop: "12px", marginLeft: "20px" }}>
      <h1>Baby Schedule Application</h1>
      <MainContainer>
        <AlternativeSleepList />
        <br />
        <SleepList />
        <ConfirmButton />
      </MainContainer>
    </div>
  );
}

const appContainer = document.querySelector("#app");
ReactDOM.render(e(Application), appContainer);
