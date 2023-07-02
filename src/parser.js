/**
 * @typedef {{ time: number, intensity: number }} colorValue
 * @typedef {{
 *   name: string,
 *   values: [colorValue],
 * }} color
 * @typedef {{
 *   version: string,
 *   checksum: string,
 *   entries: [color],
 * }} aip
 *
 * @param {string} xmlString
 * @returns {aip}
 */
export const parseXml = xmlString => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");

  /** @type {aip} */
  const aip = {};

  aip.version = doc.getElementsByTagName("version")[0].childNodes[0].nodeValue;
  aip.checksum = doc.getElementsByTagName("checksum")[0].childNodes[0].nodeValue;
  aip.entries = [];

  const colorEls = doc.getElementsByTagName("colors")[0].childNodes;

  for (let i = 0; i < colorEls.length; i++) {
    const colorEl = colorEls[i];
    if (colorEl.nodeName === "#text")
      continue;

    const color = {};
    color.name = colorEl.nodeName;
    color.values = [];

    for (let p = 0; p < colorEl.childNodes.length; p++) {
      const colorPoint = colorEl.childNodes[p];
      if (colorPoint.nodeName !== "point")
        continue;

      const pointValue = extractPointValue(colorPoint.childNodes);
      color.values.push(pointValue);
    }

    aip.entries.push(color);
  }
  return aip;
};

const extractPointValue = pointEls => {
  const pointValue = { time: null, intensity: null };
  for (let i = 0; i < pointEls.length; i++) {
    switch (pointEls[i].nodeName) {
      case "#text":
        continue;
      case "time":
        parseInt(pointValue.time = pointEls[i].childNodes[0].nodeValue);
        break;
      case "intensity":
        pointValue.intensity = pointEls[i].childNodes[0].nodeValue;
    }
  }
  return pointValue;
}
