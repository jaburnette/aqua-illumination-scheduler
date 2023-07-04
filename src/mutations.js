/**
 *
 * @param {[color]} colorEntries
 * @param {number} minutes
 * @return {aip}
 */
export const timeShift = (colorEntries, minutes) => {
  colorEntries.forEach(entry => {
    entry.values.forEach(val => {
      // skip any 0s since we likely don't want to move them
      if (parseInt(val.time) === 0)
        return;
      let newTime = parseInt(val.time) + minutes;
      if (newTime < 0)
        newTime = 0;
      if (newTime > 1440)
        newTime = 1440;
      val.time = newTime;
    });
  });
};

/**
 * Shift all intensity values by the valueDiff amount
 * @param {[color]} colorEntries
 * @param {number} intensityDiff
 * @return {aip}
 */
export const intensityShift = (colorEntries, intensityDiff) => {
  colorEntries.forEach(entry => {
    entry.values.forEach(val => {
      // skip any 0s because we likely aren't wanting those to move at all
      if (parseInt(val.intensity) === 0)
        return;
      let newValue = parseInt(val.intensity) + intensityDiff;
      if (newValue > 1800)
        newValue = 1800;
      if (newValue < 0)
        newValue = 0;
      val.intensity = newValue;
    });
  });
};