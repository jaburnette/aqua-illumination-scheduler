<script>
    import ColorPanel from "./ColorPanel.svelte";
    import Chart from "./Chart.svelte";
    import {shifter} from "./mutations";

    /** @type {aip} */
    export let aip;
    // ref to App's reset function
    export let reset;

    const aipStates = [];

    // called when a color element is updated.  passed by ref so nothing to do here except trigger an update.
    const updateAip = color => {
      aip = aip;
    };

    const undo = () => {
      aip = aipStates[aipStates.length - 2];
      aipStates.pop();
      console.log("undo");
    };

    // global shift state
    let shiftDirection = "earlier"
    let shiftMins = 0;
    // handle global time shifting
    const shift = () => {
      const minuteDiff = shiftDirection === "earlier" ? shiftMins * -1 : shiftMins;
      shifter(aip, minuteDiff);
      aip = aip;
    };
</script>

<div class="flex justify-between align-center">
    <h1 class="text-3xl font-medium pb-8">Aqua Illumination Light Scheduler</h1>
    <div>
        <span class="cursor-pointer text-red-500 border-red-500 border px-3 py-1 mr-2 rounded" on:click={reset}>Start Over</span>
        <span class="cursor-pointer text-white bg-blue-800 border-blue-800 border-2 px-3 py-1 rounded">Export</span>
    </div>
</div>
<div class="flex">
    <div class="w-3/4 pr-8">
        <div class="sticky top-0">
            <Chart aip={aip} />
        </div>
    </div>
    <div class="grow">
        <div class="rounded-md bg-white shadow mb-8">
            <h1 class="text-lg p-4 font-bold">Global Edit</h1>
            <hr />
            <div class="p-4 text-sm">
                <strong>Shift Schedule</strong>
                <div class="mt-2">
                    <select class="border p-1 rounded" bind:value={shiftDirection}>
                        <option value="earlier">Earlier</option>
                        <option value="later">Later</option>
                    </select>
                    &nbsp;by&nbsp;
                    <input bind:value={shiftMins} type="text" class="border w-10 p-1 rounded" /> &nbsp;Mins
                    <button on:click={shift} class="cursor-pointer bg-slate-900 text-xs rounded text-white p-1 pl-2 pr-2 ml-4">Apply</button>
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

