"use strict";

const e = React.createElement;
const useState = React.useState;

var model = {
  sleeps: [
    {
      duration: 40,
      asleepTime: "12:00",
      awakeTime: "12:40",
    }
  ]
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
    <a href="#" className="list-group-item list-group-item-action flex-column align-items-start ">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-2">Sleep #{props.number}</h5>
        <small>{props.data.duration} mins</small>
      </div>
      <p className="mb-1">Asleep time: {props.data.asleepTime} <DangerText>(+5 min)</DangerText></p>
      <p className="mb-1">Awake time: {props.data.awakeTime} <DangerText>(+5 min)</DangerText></p>
    </a>
  );
}

function SleepList() {
  return (
    <div className="list-group" style={{ width: "500px" }}>
      <SleepItem number="1" data={model.sleeps[0]} />
      <SleepItem number="2" data={model.sleeps[0]} />
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
