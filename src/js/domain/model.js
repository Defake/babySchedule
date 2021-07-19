const initModelData = {
  dayInput: {
    awakeTime: '06:55',
    title: "14 July",
    dayOfWeek: "Wednesday",
    daySleeps: [
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

function defineModel() {
  const [modelState, setModelState] = useState(initModelData);

  var model = {
    data: modelState,
    convertSleepsData: function (awakeTime, daySleeps) {
      // {
      //   daySleeps: [
      //     {
      //       plannedDuration: 60,
      //       asleepTime: "10:00",
      //       awakeTime: "10:40"
      //     }
      //   ]
      // }
      const firstPeriod = {
        plan: {
          awakeTime: awakeTime,
          asleepTime: "09:05",
          duration: 60,
        },
        actual: {
          awakeTime: awakeTime,
          asleepTime: "09:10",
          difference: 5,
          duration: 60,
        }
      };
      var periods = [].concat(
        daySleeps.map((sleep) => {
          return {
            plan: {
              awakeTime: "10:00",
              asleepTime: "09:05",
              duration: 60,
            },
            actual: {
              awakeTime: "10:00",
              asleepTime: "09:10",
              difference: 5,
              duration: 60,
            }
          };
        })
      );

      if (periods.length > 0) {
        periods[periods.length - 1].lastSleep = true;
      }

      return periods;
    },
    submitDaySleepsData: function (i, dayData) {
      var newDay = {
        title: dayData.title,
        dayOfWeek: dayData.dayOfWeek,
        awakeTime: dayData.awakeTime,
        sleepTime: {
          plan: "11:11",
          actual: "11:11",
        },
        wakeTime: {
          plan: "99:99",
          actual: "99:99",
        },
        dayPeriods: this.convertSleepsData(dayData.awakeTime, dayData.daySleeps)
      };
      
      var newState = Object.assign({}, modelState);
      newState.days[0] = newDay;
      setModelState(newState);
    }
  };

  return model;
}

// const ModelContext = React.createContext(model);

