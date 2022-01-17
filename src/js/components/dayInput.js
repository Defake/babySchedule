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
    initState: props.init && props.init.plannedWakeTime
  });

  const [plannedDuration, durationComp] = useCompactInput({
    name: `sleepTime[${props.i}]`,
    label: "Sleep length (mins)",
    initState: props.init && props.init.plannedDuration
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
  const [asleepTime, asleepComp] = useCompactInput({ name: `asleepTime[${props.i}]`, label: "Asleep time", initState: props.init && props.init.asleepTime });

  const [awakeTime, awakeComp] = (props.isLastSleep)
    ? [null, null]
    : useCompactInput({ name: `awakeTime[${props.i}]`, label: "Awake time", initState: props.init && props.init.awakeTime });

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
  const sleepsAmount = 3;

  const dayDataInput = props && props.model && props.model.data && props.model.data.days && props.model.data.days[0] && props.model.data.days[0] && props.model.data.days[0].inputData;
  const initTitle = dayDataInput && dayDataInput.title;
  const initPlans = dayDataInput && dayDataInput.plan;
  const initSleeps = dayDataInput && dayDataInput.sleeps;

  const [titleState, titleComp] = useCompactInput({ name: `title`, label: "Title", initState: initTitle });

  const planInputs = Array.from({ length: sleepsAmount }, (v, k) => k + 1)
    .map((sleepNum, i) => usePlanInputGroup({ i: sleepNum, key: i, init: initPlans && initPlans[i] }));

  const sleepInputs = Array.from({ length: sleepsAmount + 1 }, (v, k) => k)
    .map((sleepNum, i) => {
      return useSleepInputGroup({ i: sleepNum, key: i, isLastSleep: sleepNum == sleepsAmount, init: initSleeps && initSleeps[i] })
    });

  const planStateVars = planInputs.flatMap(([state, comp]) => [state.plannedDuration, state.plannedWakeTime]);
  const sleepStateVars = sleepInputs.flatMap(([state, comp]) => [state.asleepTime, state.awakeTime]);

  // shitcode. useEffect shouldn't update the application state
  useEffect(() => {
    props.model.submitDayPeriodsData(0, {
      title: titleState,
      plan: planInputs.map(([state, comp]) => state),
      sleeps: sleepInputs.map(([state, comp]) => state)
    });
  }, sleepStateVars.concat(planStateVars).concat([titleState]));

  return (
    <form onSubmit={() => ""}>
      <h4 className="mb-2">Day Schedule</h4>
      {titleComp}

      <h5 className="mt-3 mb-2">Day Plan</h5>
      {planInputs.map(([state, comp]) => comp)}

      <div className="d-flex flex-nowrap">
        <h5 className="mb-2">Day Actual</h5>
      </div>
      {sleepInputs.map(([state, comp]) => comp)}

    </form>
  );
}

