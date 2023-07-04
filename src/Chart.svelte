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
          max: 1800,
        },
        x: {
          max: 1440,
          min: 0,
          type: 'linear',
          ticks: {
            // Convert minutes to time string
            callback: function(value, index, ticks) {
              const date = new Date(0, 0);
              date.setMinutes(value);
              return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: ctx => {
              const date = new Date(0, 0);
              date.setMinutes(parseInt(ctx[0].label.replace(",", "")));
              return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
            },
          }
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

<div class="rounded-xl shadow md:p-8 bg-white">
    <canvas use:buildChart={aip}></canvas>
</div>