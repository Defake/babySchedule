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
    convertSleepsData: function (dayPeriods) {
      var previous = {
        plannedAwakeDt: dayPeriods[0] && new ParsedTime(dayPeriods[0].awakeTime),
      };

      var wakeDt = new ParsedTime("00:00");
      var sleepDt = new ParsedTime("00:00");

      var periods = [];
      const amount = dayPeriods.length;

      for (var i = 0; i < amount; i++) {
        const period = dayPeriods[i];
        const nextPeriod = (i + 1 < amount)
          ? dayPeriods[i + 1]
          : null;

        const awakeDt = new ParsedTime(period.awakeTime);
        const plannedWakeDt = new ParsedTime(period.plannedWakeTime);
        const asleepDt = new ParsedTime(period.asleepTime);
        const plannedDuration = period.plannedDuration;

        const plannedAwakeDt = previous.plannedAwakeDt;
        const plannedAsleepDt = plannedWakeDt.isValid
          ? plannedAwakeDt.plus({ time: plannedWakeDt.time })
          : new InvalidDtObject('?');

        const actualWakeDt = asleepDt.plus({time: -awakeDt.time});
        const nextAwakeDt = new ParsedTime(nextPeriod && nextPeriod.awakeTime);
        const actualDurationDt = nextAwakeDt.plus({ time: -asleepDt.time });
        const asleepDifference = asleepDt.plus({ time: -plannedAsleepDt.time }).time / 60 / 1000;


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
            asleepTime: asleepDt.formatTime() || "?",
            difference: asleepDifference == 0 ? null : asleepDifference,
            duration: actualDurationDt.isValid
              ? actualDurationDt.time / 60 / 1000
              : null,
          }
        });

        previous = {
          plannedAwakeDt: plannedDuration ? plannedAsleepDt.plus({ minutes: plannedDuration }) : new InvalidDtObject(),
        };

        wakeDt = wakeDt.plus({time: actualWakeDt.time});
        sleepDt = sleepDt.plus({time: actualDurationDt.time});
      }

      return {
        periods,
        wakeTime: wakeDt.formatTime(),
        sleepTime: sleepDt.formatTime()
      };
    },

    submitDayPeriodsData: function (i, dayData) {
      const convertedPeriods = this.convertSleepsData(dayData.dayPeriods);

      var newDay = {
        title: dayData.title,
        dayOfWeek: dayData.dayOfWeek,
        awakeTime: dayData.awakeTime,
        sleepTime: {
          plan: "11:11",
          actual: convertedPeriods.sleepTime,
        },
        wakeTime: {
          plan: "99:99",
          actual: convertedPeriods.wakeTime,
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

