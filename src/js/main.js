"use strict";

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

function MainContainer(props) {
  return (
    <div style={{ maxWidth: "1000px" }} className="mt-3 row mb-5">
      {props.children}
    </div>
  );
}

function Application() {
  const model = defineModel();
  
  return (
    <div style={{ marginTop: "12px", marginLeft: "20px" }}>
      <h1>Baby Schedule Application</h1>

      <MainContainer>
        <div className="col-sm-6">

          <TimelineSleepList days={model.data && model.data.days} />

          <br />

          <ConfirmButton />
        </div>
        <div className="col-sm-6">
          <DayInputForm model={model} />
        </div>
      </MainContainer>
      
    </div>
  );
}

const appContainer = document.querySelector("#app");
ReactDOM.render(e(Application), appContainer);
