const initModelData = {
  dayInput: {
    title: "14 July",
    dayOfWeek: "Wednesday",
    dayPeriods: [
      {
        plannedDuration: 60,
        asleepTime: "10:00",
        awakeTime: "10:40"
      }
    ]
  },
  initialPlan: [
    {
      wakeTime: "02:35",
      sleepTime: 45
    },
    {
      wakeTime: "02:55",
      sleepTime: 2 * 60
    },
    {
      wakeTime: "02:55",
      sleepTime: 45
    },
    {
      wakeTime: "03:10",
      sleepTime: 8 * 60
    },
  ],
  days: [
    {
      title: "14 July",
      dayOfWeek: "Wednesday",
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

function defineModel() {
  const [modelState, setModelState] = useState(initModelData);

  var model = {
    data: modelState,
    convertSleepsData: function (dayMerged) {
      const dayAwakeDt = dayMerged.periods[0] != null && new ParsedTime(dayMerged.periods[0].awakeTime);

      var previous = {
        plannedAwakeDt: dayAwakeDt
      };

      var wakeDts = {
        plan: new ParsedTime("00:00"),
        actual: new ParsedTime("00:00"),
      };
      var sleepDts = {
        plan: new ParsedTime("00:00"),
        actual: new ParsedTime("00:00"),
      };

      var periods = [];
      const amount = dayMerged.periods.length;

      for (var i = 0; i < amount; i++) {
        const period = dayMerged.periods[i];
        const nextPeriod = (i + 1 < amount)
          ? dayMerged.periods[i + 1]
          : null;

        const awakeDt = new ParsedTime(period.awakeTime);
        const plannedWakeDt = new ParsedTime(period.plannedWakeTime);
        const asleepDt = new ParsedTime(period.asleepTime);
        const plannedDuration = period.plannedDuration;
        const plannedDurationDt = new ParsedTime("00:00").plus({ minutes: period.plannedDuration });


        const plannedAwakeDt = previous.plannedAwakeDt;
        const plannedAsleepDt = plannedWakeDt.isValid
          ? (awakeDt.isValid
            ? awakeDt.plus({ time: plannedWakeDt.time })
            : plannedAwakeDt.plus({ time: plannedWakeDt.time }))
          : new InvalidDtObject('?');

        const actualWakeDt = asleepDt.plus({ time: -awakeDt.time });
        const nextAwakeDt = new ParsedTime(nextPeriod && nextPeriod.awakeTime);
        const actualDurationDt = nextAwakeDt.plus({ time: -asleepDt.time });

        const wakeDifference = actualWakeDt.plus({ time: -plannedWakeDt.time }).time / 60 / 1000;
        const sleepDifference = actualDurationDt.plus({ minutes: -plannedDuration }).time / 60 / 1000;

        periods.push({
          lastSleep: i + 1 == amount,
          plan: {
            awakeTime: plannedAwakeDt.formatTime(),
            wakeTime: plannedWakeDt.formatTime(),
            asleepTime: plannedAsleepDt.formatTime(),
            duration: period.plannedDuration,
          },
          actual: {
            awakeTime: awakeDt.formatTime(),
            wakeTime: actualWakeDt.formatTime(),
            asleepTime: asleepDt.formatTime(),
            wakeDifference: wakeDifference == 0 ? null : wakeDifference,
            sleepDifference: sleepDifference == 0 ? null : sleepDifference,
            duration: actualDurationDt.isValid
              ? actualDurationDt.time / 60 / 1000
              : null,
          }
        });

        previous = {
          plannedAwakeDt: plannedDuration
            ? (asleepDt.isValid
              ? asleepDt.plus({ minutes: plannedDuration })
              : plannedAsleepDt.plus({ minutes: plannedDuration }))
            : new InvalidDtObject(),
        };

        wakeDts = {
          plan: wakeDts.plan.plus({
            time: (actualWakeDt.isValid
              ? actualWakeDt.time
              : plannedWakeDt.time)
          }),
          actual: wakeDts.actual.plus({ time: actualWakeDt.time }),
        };

        sleepDts = {
          plan: sleepDts.plan.plus({
            time: (i == amount - 1)
              ? 0
              : (actualDurationDt.isValid
                ? actualDurationDt.time
                : plannedDurationDt.time)
          }),
          actual: sleepDts.actual.plus({ time: actualDurationDt.time }),
        };
      }

      return {
        periods,
        wakeTime: wakeDts,
        sleepTime: sleepDts,
        nightTime: dayAwakeDt.plus({ days: 1, time: -new ParsedTime(dayMerged.previousNightAsleepTime).time }).formatTime()
      };
    },

    mergeDayData: function (plan, sleeps) {
      var periods = [];

      for (var i = 0; i < sleeps.length - 1; i++) {
        const current = sleeps[i];
        const next = sleeps[i + 1];

        periods.push({
          awakeTime: current && current.awakeTime,
          asleepTime: next && next.asleepTime,
          plannedDuration: plan[i] && plan[i].plannedDuration,
          plannedWakeTime: plan[i] && plan[i].plannedWakeTime,
        });
      }

      return {
        previousNightAsleepTime: sleeps[0] && sleeps[0].asleepTime,
        periods
      };
    },

    submitDayPeriodsData: function (i, dayData) {
      const dayMerged = this.mergeDayData(dayData.plan, dayData.sleeps);
      const convertedPeriods = this.convertSleepsData(dayMerged);

      var newDay = {
        title: dayData.title,
        awakeTime: dayData.awakeTime,
        sleepTime: {
          plan: convertedPeriods.sleepTime.plan.formatTime(),
          actual: convertedPeriods.sleepTime.actual.formatTime(),
        },
        wakeTime: {
          plan: convertedPeriods.wakeTime.plan.formatTime(),
          actual: convertedPeriods.wakeTime.actual.formatTime(),
        },
        nightTime: {
          actual: convertedPeriods.nightTime,
        },
        dayPeriods: convertedPeriods.periods
      };

      var newState = Object.assign({}, modelState);
      newState.days[0] = newDay;
      setModelState(newState);
    }
  };

  return model;
}

// const ModelContext = React.createContext(model);

