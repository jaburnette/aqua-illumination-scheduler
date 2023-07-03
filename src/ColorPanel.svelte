<script>
import { createEventDispatcher } from 'svelte'
import {colorMap} from "./colorMap.js";
import {intensityShift, timeShift} from "./mutations.js";

const dispatch = createEventDispatcher();
/** @type {color} */
export let color;
let valuesExpanded = false;
let groupEditExpanded = false;

// store new value addition
let isAdding = false;
let newTime = "12:00";
let newIntensity = 0;

// convert from minutes to display value
const minutesToTime = seconds => {
  const date = new Date(0, 0);
  date.setMinutes(seconds);
  return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
};

// toggle visibility of panels
const toggleValues = () => valuesExpanded = !valuesExpanded;
const toggleGroupEdit = () => groupEditExpanded = !groupEditExpanded;

// handle time/intensity updates
const updateIntensity = (e, value) => {
  value.intensity = e.target.value;
  color = color;
  dispatch("colorChanged", color);
}
const updateTime = (e, value) => {
  // split the time on :, multiply hours by 60 and then add the minutes
  value.time = parseInt(e.target.value.split(":")[0]) * 60 + parseInt(e.target.value.split(":")[1]);

  // we always have to re-sort to keep them in order when the time changes
  color.values.sort((valA, valB) => parseInt(valA.time) > parseInt(valB.time) ? 1 : -1);
  color = color;
  dispatch("colorChanged", color);
};

// handle addition and deletion of values
const deleteValue = value => {
  color.values.splice(color.values.indexOf(value), 1);
  color = color;
  dispatch("colorChanged", color);
};
const saveNewValue = () => {
  // create the new value, add it to the color array, resort, and notify the parent component
  let intensity = parseInt(newIntensity);
  if (isNaN(intensity))
    intensity = 0;
  const newValue = {
    time: parseInt(newTime.split(":")[0]) * 60 + parseInt(newTime.split(":")[1]),
    intensity: intensity,
  };
  color.values.push(newValue);
  color.values.sort((valA, valB) => parseInt(valA.time) > parseInt(valB.time) ? 1 : -1);
  color = color;
  dispatch("colorChanged", color);

  // reset the add form
  newTime = null;
  newIntensity = null;
  isAdding = false;
};

// time shift
let shiftTimeDirection = "earlier"
let shiftTimeMins = 0;
const shiftTime = () => {
  const minuteDiff = shiftTimeDirection === "earlier" ? shiftTimeMins * -1 : shiftTimeMins * 1;
  timeShift([color], minuteDiff);
  color = color;
  dispatch("colorChanged", color);
};

// intensity shift
let shiftIntensityDirection = "higher"
let shiftIntensityVal = 0;
const shiftIntensity = () => {
  if (parseInt(shiftIntensityVal) < 0)
    shiftIntensityVal *= -1;
  const intensityDiff = shiftIntensityDirection === "lower" ? shiftIntensityVal * -1 : shiftIntensityVal * 1;
  intensityShift([color], intensityDiff);
  color = color;
  dispatch("colorChanged", color);
};

</script>

<div class="colorPanel">
    <h2 class="font-medium text-md p-3 pl-4 pr-4">
        <span class="w-2 h-2 inline-block" style={"background-color:" + colorMap(color.name)}></span> {color.name}
    </h2>
    <div class="p-4 pt-1 pl-5 cursor-pointer uppercase text-xs font-medium" on:click={toggleGroupEdit} on:keyup={toggleGroupEdit}>
        {#if groupEditExpanded}&uarr;{:else}&darr;{/if} Group Edit
    </div>
    <div class={" " + (groupEditExpanded ? "block" : "hidden")}>
        <div class="px-5 pb-2 text-sm">
            <strong>Shift Schedule</strong>
            <div class="mt-2">
                <select class="border p-1 rounded" bind:value={shiftTimeDirection}>
                    <option value="earlier">Earlier</option>
                    <option value="later">Later</option>
                </select>
                &nbsp;by&nbsp;
                <input bind:value={shiftTimeMins} type="text" class="border w-10 p-1 rounded" /> &nbsp;Mins
                <button on:click={shiftTime} class="cursor-pointer bg-slate-900 text-xs rounded text-white p-1 pl-2 pr-2 ml-4">Apply</button>
            </div>
        </div>
        <div class="px-5 pb-4 text-sm">
            <strong>Shift Intensity</strong>
            <div class="mt-2">
                <select class="border p-1 rounded" bind:value={shiftIntensityDirection}>
                    <option value="higher">Higher</option>
                    <option value="lower">Lower</option>
                </select>
                &nbsp;by&nbsp;
                <input bind:value={shiftIntensityVal} type="text" class="border w-10 p-1 rounded" />
                <button on:click={shiftIntensity} class="cursor-pointer bg-slate-900 text-xs rounded text-white p-1 pl-2 pr-2 ml-4">Apply</button>
            </div>
        </div>
    </div>
    <div class="p-4 pt-1 pl-5 cursor-pointer uppercase text-xs font-medium" on:click={toggleValues} on:keyup={toggleValues}>
        {#if valuesExpanded}&uarr;{:else}&darr;{/if} Values
    </div>
    <div class={"grid grid-cols-3 p-5 pt-0 text-sm " + (valuesExpanded ? "block" : "hidden")}>
        <strong class="pb-1">Time</strong>
        <strong class="text-center pb-1">Intensity</strong>
        <strong class="pb-1"></strong>
        {#each color.values as value}
            <div class="pt-1">
                <input type="time" value={minutesToTime(value.time)} style="width: 100px" on:change={e => updateTime(e, value)} />
            </div>
            <div class="pt-1 text-center">
                <input type="text" value={value.intensity} class="w-10 border p-1" on:change={e => updateIntensity(e, value)} />
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
        {#if !isAdding}
            <span
                class="cursor-pointer border border-slate-900 text-xs rounded text-slate-900 p-1 text-center"
                on:click={() => isAdding = true}>
                    + Add
            </span>
        {:else}
            <div class="pt-1">
                <input type="time" style="width: 100px" bind:value={newTime} />
            </div>
            <div class="pt-1 text-center">
                <input type="text" class="w-10 border p-1" bind:value={newIntensity} />
            </div>
            <div class="pt-1 flex align-center">
                <span
                    class="cursor-pointer bg-slate-900 text-xs rounded text-white p-2 text-center"
                    on:click={saveNewValue}
                    >
                    Save
                </span>
            </div>
        {/if}
    </div>

</div>