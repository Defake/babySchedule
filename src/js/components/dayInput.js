function useCompactInput(props) {
  const [state, setState] = useState("");

  const component = (
    <div className="mb-2">
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

function usePeriodInputGroup(props) {
  const [awakeTime, awakeComp] = useCompactInput({ name: `awakeTime[${props.sleepNum}]`, label: "Awake time" });
  const [wakeTime, wakeComp] = useCompactInput({ name: `wakeTime[${props.sleepNum}]`, label: "Planned wake time" });
  const [asleepTime, asleepComp] = useCompactInput({ name: `asleepTime[${props.sleepNum}]`, label: "Asleep time" });
  const [plannedDuration, durationComp] = useCompactInput({ name: `sleepTime[${props.sleepNum}]`, label: "Planned sleep length (mins)" });

  const state = {
    awakeTime: awakeTime,
    plannedWakeTime: wakeTime,
    asleepTime: asleepTime,
    plannedDuration: plannedDuration,
  }

  const component = (
    <div key={props.key}>
      <div className="mb-1 mt-3">Awake #{props.sleepNum}</div>
      {awakeComp}
      {wakeComp}
      {asleepComp}
      {durationComp}
    </div>
  );

  return [state, component];
}

function DayInputForm(props) {
  const periodInputs = [1, 2, 3, 4]
    .map((sleepNum, i) => usePeriodInputGroup({ sleepNum: sleepNum, key: i }));

  const periodsStateVars = periodInputs.flatMap(([state, comp]) => [state.plannedDuration, state.asleepTime, state.awakeTime, state.plannedWakeTime]);

  // shitcode. useEffect shouldn't update the application state
  useEffect(() => {
    console.log("EFFECT");
    props.model.submitDayPeriodsData(0, {
      title: "14 July",
      dayOfWeek: "Wednesday",
      dayPeriods: periodInputs.map(([state, comp]) => state)
    });
  }, periodsStateVars);

  return (
    <form onSubmit={() => ""}>
      <h4 className="mb-3">Day Input</h4>
      {periodInputs.map(([state, comp]) => comp)}

    </form>
  );
}

