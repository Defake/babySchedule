"use strict";

const e = React.createElement;
const useState = React.useState;

var model = {
  days: [
    {
      title: "14 July",
      dayOfWeek: "Wednesday",
      awakeTime: "06:50",
      sleepTime: "04:10",
      wakeTime: "10:55",
      sleeps: [
        {
          duration: 60,
          asleepTime: "09:10",
          awakeTime: "10:10",
        },
        {
          duration: 120,
          asleepTime: "13:00",
          awakeTime: "15:00",
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
    <li class="list-group-item">
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
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{day.title}, {day.dayOfWeek}</h5>
        <h6 class="card-subtitle text-muted">Awake time – {day.awakeTime}</h6>
      </div>

      <ul class="list-group list-group-flush">
        {day.sleeps.map((sleep, i) => <SleepItem sleep={sleep} key={i} number={i+1} />)}
      </ul>

      <div class="card-footer text-muted">
        Wake time – {day.wakeTime}, Sleep time – {day.sleepTime}
      </div>
    </div>

    // <div className="list-group" style={{ width: "500px" }}>

    //   <SleepItem number="1" data={model.sleeps[0]} />
    //   <SleepItem number="2" data={model.sleeps[0]} />
    // </div>
  );
}

function SleepList() {
  return (
    <div>
      {model.days.map((day, i) => <DayCard day={day} key={i} />)}
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
        <SleepList />
        <ConfirmButton />
      </MainContainer>
    </div>
  );
}

const appContainer = document.querySelector("#app");
ReactDOM.render(e(Application), appContainer);
