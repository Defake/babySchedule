// var userTimezoneOffset = date.getTimezoneOffset() * 60000;

function toUTC(date) {
  var utcValue = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(utcValue);
}

function timeUtil_plusTime(datetime, time) {
  return toUTC(new Date(datetime.getTime() + time));
}

function timeUtil_plusMinutes(datetime, minutes) {
  return timeUtil_plusTime(datetime, minutes * 60 * 1000);
}

function timeUtil_plusHours(datetime, hours) {
  return timeUtil_plusMinutes(datetime, hours * 60);
}

function timeUtil_plusDays(datetime, days) {
  return timeUtil_plusHours(datetime, days * 24);
}

function DtObject(datetimeOriginal) {

  if (!(datetimeOriginal instanceof Date)) {
    return new Error("DtObject constructor only accepts Date object");
  }

  const datetime = toUTC(new Date(datetimeOriginal.getTime()));

  function plus(units) {
    var dt = datetime;

    if (units.time) {
      dt = timeUtil_plusTime(dt, units.time);
    }

    if (units.minutes) {
      dt = timeUtil_plusMinutes(dt, units.minutes);
    }

    if (units.hours) {
      dt = timeUtil_plusHours(dt, units.hours);
    }

    if (units.days) {
      dt = timeUtil_plusDays(dt, units.days);
    }

    return new DtObject(dt);
  }

  // function addDt(dateTime2) {
  //   var minutes = dateTime1.getHours()
  //   return plusMinutes(new Date(), minutes);
  // }

  function formatTime() {
    return String(datetime.getUTCHours()).padStart(2, '0')
      + ':'
      + String(datetime.getUTCMinutes()).padStart(2, '0');;
  }

  return {
    isValid: true,
    time: datetime.getTime(),
    plus,
    formatTime
  };
}

function InvalidDtObject(formatString) {
  return {
    isValid: false,
    time: 0,
    plus: function (units) { return this; },
    formatTime: function () {
      // return "";
      return "" + formatString;
    }
  };
}


function timeUtils_parseTime(timeStr) {
  if (typeof(timeStr) != "string") {
    return null;
  }

  const matched = timeStr.match(/(\d\d):(\d\d)/);
  if (!matched) {
    return null;
  }

  var date = toUTC(new Date(0));
  date.setUTCHours(parseInt(matched[1]) || 0);
  date.setUTCMinutes(parseInt(matched[2]) || 0);

  return date;
}

function ParsedTime(timeStr) {
  const parsed = timeUtils_parseTime(timeStr);
  if (parsed) {
    return new DtObject(parsed);
  } else {
    return new InvalidDtObject(timeStr);
  }
}

