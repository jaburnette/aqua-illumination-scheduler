<script>
    import ColorPanel from "./ColorPanel.svelte";
    import Chart from "./Chart.svelte";
    import {shifter} from "./mutations";

    /** @type {aip} */
    export let aip;

    const aipStates = [];

    let shiftDirection = "earlier"
    let shiftMins = 0;

    const updateAip = color => {
      aip = aip;
    };

    const undo = () => {
      aip = aipStates[aipStates.length - 2];
      aipStates.pop();
      console.log("undo");
    };

    const shift = () => {
      const minuteDiff = shiftDirection === "earlier" ? shiftMins * -1 : shiftMins;
      shifter(aip, minuteDiff);
      aip = aip;
    };
</script>

<h1 class="text-3xl font-medium pb-8 text-center">Aqua Illumination Light Scheduler</h1>
<div class="flex">
    <div class="w-3/4 pr-8">
        <Chart aip={aip} />
    </div>
    <div class="grow">
        <div class="rounded-md bg-white shadow mb-8">
            <h1 class="text-lg p-4 font-bold">Global Edit</h1>
            <hr />
            <div class="p-4 text-sm">
                <strong>Shift Schedule</strong>
                <div class="mt-2">
                    <select class="border p-1" bind:value={shiftDirection}>
                        <option value="earlier">Earlier</option>
                        <option value="later">Later</option>
                    </select>
                    &nbsp;by&nbsp;
                    <input bind:value={shiftMins} type="text" class="border w-10 p-1" /> &nbsp;Mins
                    <button on:click={shift} class="cursor-pointer bg-black rounded-md text-white p-1 pl-2 pr-2 ml-4">Run</button>
                </div>
            </div>
        </div>
        <div class="rounded-md shadow bg-white mb-16">
            <h1 class="text-lg p-4 font-bold">Color Channels</h1>
            <hr />
            {#each aip.entries as entry}
                <ColorPanel color={entry} on:colorChanged={updateAip} />
            {/each}
        </div>
    </div>
</div>

