function useCompactInput(props) {
  const [state, setState] = useState(props.initState || "");

  const component = (
    <div className="mb-2 me-2" style={{ flex: "1 1 50px" }}>
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        name={props.name}
        type={props.type || "text"}
        className="form-control form-control-sm"
        placeholder={props.label} />
    </div>
  )
  return [state, component];
}

function usePlanInputGroup(props) {
  const [wakeTime, wakeComp] = useCompactInput({
    name: `wakeTime[${props.i}]`,
    label: "Wake time",
    initState: props.init && props.init.wakeTime
  });

  const [plannedDuration, durationComp] = useCompactInput({
    name: `sleepTime[${props.i}]`,
    label: "Sleep length (mins)",
    initState: props.init && props.init.sleepTime
  });

  const state = {
    plannedWakeTime: wakeTime,
    plannedDuration: plannedDuration,
  }

  const component = (
    <div className="d-flex justify-content-between" key={props.key}>
      <div className="text-nowrap mb-1 me-3" style={{ width: "70px" }}>Plan #{props.i}</div>
      {wakeComp}
      {durationComp}
    </div>
  );

  return [state, component];
}

function useSleepInputGroup(props) {
  const [asleepTime, asleepComp] = useCompactInput({ name: `asleepTime[${props.i}]`, label: "Asleep time" });

  const [awakeTime, awakeComp] = (props.isLastSleep)
    ? [null, null]
    : useCompactInput({ name: `awakeTime[${props.i}]`, label: "Awake time" });

  const state = {
    awakeTime: awakeTime,
    asleepTime: asleepTime,
  }

  const component = (
    <div className="d-flex justify-content-between" key={props.key}>
      <div className="text-nowrap mb-1 me-3" style={{ width: "70px" }}>
        {
          (props.i == 0)
            ? "Night"
            : "Sleep #" + props.i
        }
      </div>
      {asleepComp}
      {
        (props.isLastSleep)
          ? <div className="mb-2 me-2" style={{ flex: "1 1 50px" }}></div>
          : awakeComp
      }
    </div>
  );

  return [state, component];
}

function DayInputForm(props) {
  const sleepsAmount = 4;

  const planInputs = Array.from({ length: sleepsAmount }, (v, k) => k + 1)
    .map((sleepNum, i) => usePlanInputGroup({ i: sleepNum, key: i, init: props.model.data.initialPlan[i] }));

  const sleepInputs = Array.from({ length: sleepsAmount + 1 }, (v, k) => k)
    .map((sleepNum, i) => useSleepInputGroup({ i: sleepNum, key: i, isLastSleep: sleepNum == sleepsAmount }));

  const planStateVars = planInputs.flatMap(([state, comp]) => [state.plannedDuration, state.plannedWakeTime]);
  const sleepStateVars = sleepInputs.flatMap(([state, comp]) => [state.asleepTime, state.awakeTime]);

  // shitcode. useEffect shouldn't update the application state
  useEffect(() => {
    props.model.submitDayPeriodsData(0, {
      title: "14 July",
      dayOfWeek: "Wednesday",
      plan: planInputs.map(([state, comp]) => state),
      sleeps: sleepInputs.map(([state, comp]) => state)
    });
  }, sleepStateVars.concat(planStateVars));

  return (
    <form onSubmit={() => ""}>
      <h4 className="mb-3">Day Plan</h4>
      {planInputs.map(([state, comp]) => comp)}

      <h4 className="mb-3">Day Actual</h4>
      {sleepInputs.map(([state, comp]) => comp)}

    </form>
  );
}

