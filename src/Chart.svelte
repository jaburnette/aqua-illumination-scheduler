<script>
import { colorMap } from "./colorMap";
import { Chart } from "chart.js/auto";

/** @type {aip} */
export let aip;
let ctx;
let chart;

const buildChart = (ctx,d) => {
  chart = new Chart(ctx, {
    type: "line",
    data: buildDataset(),
    options: {
      animation: false,
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 1024,
        },
        x: {
          max: 1440,
          min: 0,
          type: 'linear',
        }
      }
    },
  });
  return {
    update(){
      chart.data = buildDataset();
      chart.update()
    },
    destroy(){ chart.destroy();	}
  }
}

const buildDataset = () => {
  return {
    /** @param {color} entry **/
    datasets: aip.entries.map(entry => {
      return {
        label: entry.name,
        backgroundColor: colorMap(entry.name),
        borderColor: colorMap(entry.name),
        data: entry.values.map(val => [val.time, val.intensity]),
      }
    }),
  };
};
</script>

<div class="rounded-xl shadow p-8 bg-white">
    <canvas use:buildChart={aip}></canvas>
</div>