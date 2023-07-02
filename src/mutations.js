/**
 *
 * @param {aip} aip
 * @param {number} minutes
 * @return {aip}
 */
export const shifter = async (aip, minutes) => {
  await aip.entries.forEach(entry => {
    entry.values.forEach(val => {
      const newTime = parseInt(val.time) + minutes;
      console.log(newTime);
      if (newTime >= 0)
        val.time = newTime;
    });
  });
};