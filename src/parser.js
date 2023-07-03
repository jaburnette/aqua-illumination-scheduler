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

// takes the xml inside of a .aip file and turns it into an AIP object
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

/**
 * loops through all the elements in a color node and extracts the values
 * @param pointEls
 * @returns {colorValue}
 */
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
};

/**
 * Serialize back out to an XML string
 * @param {aip} aip
 * **/
export const serializeXml = aip => {
  // base document
  const aipXml = document.implementation.createDocument(null, "ramp");
  // parent node is named "ramp"
  const rampEl = aipXml.getElementsByTagName("ramp")[0];

  // go ahead and create the header and colors elements
  const headerEl = aipXml.createElement("header");
  rampEl.appendChild(headerEl);
  const colorsEl = aipXml.createElement("colors");
  rampEl.appendChild(colorsEl);

  // loop through each color in our aip obj to build its point elements
  aip.entries.forEach(async e => {
    const colorEl = aipXml.createElement(e.name);
    // append color el to the parent colors array
    colorsEl.appendChild(colorEl);
    // loop through each value in this color and build the time/intensity point elements
    e.values.forEach(v => {
      // parent point element
      const pointEl = aipXml.createElement("point");
      // add the point element to its color element
      colorEl.appendChild(pointEl);

      const intensityEl = aipXml.createElement("intensity");
      intensityEl.textContent = parseInt(v.intensity);
      const timeEl = aipXml.createElement("time");
      timeEl.textContent = parseInt(v.time);

      // add time and intensity to the point element
      pointEl.appendChild(intensityEl);
      pointEl.appendChild(timeEl);
    });
  });

  // build the header
  const versionEl = aipXml.createElement("version");
  const checksumEl = aipXml.createElement("checksum");
  headerEl.appendChild(versionEl);
  headerEl.appendChild(checksumEl);

  // set version and checksum
  versionEl.textContent = 2;
  checksumEl.textContent = calculateChecksum(aipXml);

  return "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>\n" + (new XMLSerializer()).serializeToString(aipXml);
};

/**
 * Calculates the checksum of the values that were set.  I'm not entirely sure how this works so full credit to
 * https://github.com/d0ughb0y/d0ughb0y.github.io
 * @param aipXml
 * @returns {number}
 */
const calculateChecksum = aipXml => {
  const colorsEl = aipXml.getElementsByTagName("colors")[0];
  const colorsStr = (new XMLSerializer()).serializeToString(colorsEl);
  let checksum = 0;
  for (let c of colorsStr) {
    checksum = (((checksum << 5) - checksum) + c.charCodeAt(0)) & 0xFFFFFFFF;
  }
  if (checksum < 0) {
    checksum = ~checksum;
  }
  return checksum;
};
