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
 * @param {string} intensityShiftUnit
 * @return {aip}
 */
export const intensityShift = (colorEntries, intensityDiff, intensityShiftUnit) => {
  colorEntries.forEach(entry => {
    entry.values.forEach(val => {
      // skip any 0s because we likely aren't wanting those to move at all
      if (parseInt(val.intensity) === 0)
        return;

      let newValue = parseInt(val.intensity);

      // if percent, calculate the delta of the % of current intensity
      let intensityAmount =
        intensityShiftUnit === 'percent'
          ? Math.floor(newValue * (intensityDiff * 0.01))
          : intensityDiff;

      newValue += intensityAmount;

      // 0 < n < 1800
      newValue = Math.min(Math.max(newValue, 0), 1800);

      val.intensity = newValue;
    });
  });
};