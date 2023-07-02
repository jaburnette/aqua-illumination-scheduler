<script>
import { createEventDispatcher } from 'svelte'
import {colorMap} from "./colorMap.js";

const dispatch = createEventDispatcher();
/** @type {color} */
export let color;
$: valuesExpanded = false;

// convert from seconds to display value
const secondsToTime = seconds => {
  const date = new Date(0, 0);

  date.setMinutes(seconds);
  return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
};

// toggle visibility of values in panel
const toggleValues = () => valuesExpanded = !valuesExpanded;

// delete an intensity value
const deleteValue = value => {
  color.values.splice(color.values.indexOf(value), 1);
  color = color;
  dispatch("colorChanged", color);
};

</script>

<div class="colorPanel">
    <h2 class="font-medium text-md p-3 pl-4 pr-4">
        <span class="w-2 h-2 inline-block" style={"background-color:" + colorMap(color.name)}></span> {color.name}
    </h2>
    <div class="p-4 pt-1 pl-5 cursor-pointer uppercase text-xs font-medium" on:click={toggleValues} on:keyup={toggleValues}>
        {#if valuesExpanded}&uarr;{:else}&darr;{/if} Values
    </div>
    <div class={"grid grid-cols-3 p-5 pt-0 " + (valuesExpanded ? "block" : "hidden")}>
        <strong class="pb-1">Time</strong>
        <strong class="text-center pb-1">Intensity</strong>
        <strong class="pb-1"></strong>
        {#each color.values as value}
            <div class="pt-1">
                <input type="time" value={secondsToTime(value.time)} style="width: 110px" />
            </div>
            <div class="pt-1 text-center">
                <input type="text" value={value.intensity} class="w-12 border p-1" />
            </div>
            <div class="pt-1 flex align-center">
                <img
                    src="/garbage-can.png"
                    alt="delete"
                    class={"w-4 object-contain cursor-pointer " + (value.time > 0 ? "block" : "hidden")}
                    on:click={() => deleteValue(value)}
                    on:keyup={() => deleteValue(value)}
                />
            </div>
        {/each}
    </div>

</div>