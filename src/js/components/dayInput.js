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

function useSleepInputGroup(props) {
  const [plannedDuration, durationComp] = useCompactInput({ name: `sleepTime[${props.sleepNum}]`, label: "Planned sleep length (mins)" });
  const [asleepTime, asleepComp] = useCompactInput({ name: `asleepTime[${props.sleepNum}]`, label: "Asleep time" });
  const [awakeTime, awakeComp] = useCompactInput({ name: `awakeTime[${props.sleepNum}]`, label: "Awake time" });
  const state = {
    plannedDuration: plannedDuration,
    asleepTime: asleepTime,
    awakeTime: awakeTime
  }

  const component = (
    <div key={props.key}>
      <div className="mb-1 mt-3">Sleep #{props.sleepNum}</div>
      {durationComp}
      {asleepComp}
      {awakeComp}

    </div>
  );

  return [state, component];
}

function DayInputForm(props) {
  const [dayAwakeTime, dayAwakeComp] = useCompactInput({ name: "awakeTime", label: "Day awake time" });

  const sleepInputs = [1, 2, 3, 4]
    .map((sleepNum, i) => useSleepInputGroup({ sleepNum: sleepNum, key: i }));
  
  // shitcode. useEffect shouldn't update the application state
  useEffect(() => {
    props.model.submitDaySleepsData(0, {
      awakeTime: dayAwakeTime,
      title: "14 July",
      dayOfWeek: "Wednesday",
      daySleeps: sleepInputs.map(([sleepState, sleepComp]) => sleepState)
    });
  }, [dayAwakeTime]);

  return (
    <form onSubmit={() => ""}>
      <h4 className="mb-3">Day Input</h4>
      {dayAwakeComp}
      {sleepInputs.map(([sleepState, sleepComp]) => sleepComp)}

    </form>
  );
}

