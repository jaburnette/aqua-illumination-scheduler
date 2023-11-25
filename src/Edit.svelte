<script>
    import ColorPanel from "./ColorPanel.svelte";
    import Chart from "./Chart.svelte";
    import {intensityShift, timeShift} from "./mutations";
    import {serializeXml} from "./parser.js";

    /** @type {aip} */
    export let aip;
    // ref to App's reset function
    export let reset;

    const aipStates = [];

    // called when a color element is updated.  passed by ref so nothing to do here except trigger an update.
    const updateAip = () => {
      aip = aip;
      localStorage.setItem("aip", JSON.stringify(aip));
    };

    const undo = () => {
      aip = aipStates[aipStates.length - 2];
      aipStates.pop();
      console.log("undo");
    };

    // global shift time
    let shiftTimeDirection = "earlier"
    let shiftTimeMins = 0;
    const shiftTime = () => {
      if (parseInt(shiftTimeMins) < 0)
        shiftTimeMins *= -1;
      const minuteDiff = shiftTimeDirection === "earlier" ? shiftTimeMins * -1 : shiftTimeMins * 1;
      timeShift(aip.entries, minuteDiff);
      aip = aip;
    };

    // global shift intensity
    let shiftIntensityDirection = "lower"
    let shiftIntensityUnit = "percent";
    let shiftIntensityVal = 0;
    const shiftIntensity = () => {
      if (parseInt(shiftIntensityVal) < 0)
        shiftIntensityVal *= -1;

      const intensityDiff =
        shiftIntensityDirection === "lower"
        ? shiftIntensityVal * -1
        : shiftIntensityVal * 1;

      intensityShift(aip.entries, intensityDiff, shiftIntensityUnit);

      aip = aip;
    };

    // force a file download of the xml string
    const exportSchedule = () => {
      const xmlString = serializeXml(aip);
      const blob = new Blob([xmlString], {type: "text/xml"});
      const downloadEl = document.createElement("a");
      downloadEl.href = URL.createObjectURL(blob);
      downloadEl.download = "ai-schedule.aip";
      document.body.appendChild(downloadEl);
      downloadEl.click();
      document.body.removeChild(downloadEl);
    };
</script>

<div class="md:flex justify-between align-center">
    <h1 class="text-2xl md:text-3xl font-medium pb-4 md:pb-8">Aqua Illumination Light Scheduler</h1>
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white text-right md:relative md:bg-transparent">
        <span class="cursor-pointer text-red-500 border-red-500 border px-3 py-1 mr-2 rounded" on:click={reset}>Start Over</span>
        <span class="cursor-pointer text-white bg-blue-800 border-blue-800 border-2 px-3 py-1 rounded" on:click={exportSchedule}>Export</span>
    </div>
</div>
<div class="md:flex">
    <div class="md:w-3/4 md:pr-8">
        <div class="sticky top-0">
            <Chart aip={aip} />
        </div>
    </div>
    <div class="grow">
        <div class="rounded-md bg-white shadow mb-8 mt-8 md:mt-0">
            <h1 class="text-lg p-4 font-bold">Global Edit</h1>
            <hr />
            <div class="p-4 pb-0 text-sm">
                <strong>Shift Time</strong>
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
            <div class="p-4 text-sm">
                <strong>Shift Intensity</strong>
                <div class="mt-2">
                    <select class="border p-1 rounded" bind:value={shiftIntensityDirection}>
                        <option value="lower">Lower</option>
                        <option value="higher">Higher</option>
                    </select>
                    &nbsp;by&nbsp;
                    <input bind:value={shiftIntensityVal} type="text" class="border w-10 p-1 rounded" />
                    <select class="border p-1 rounded" bind:value={shiftIntensityUnit}>
                        <option value="percent">%</option>
                        <option value="points">points</option>
                    </select>
                    <button on:click={shiftIntensity} class="cursor-pointer bg-slate-900 text-xs rounded text-white p-1 pl-2 pr-2 ml-4">Apply</button>
                </div>
            </div>
        </div>
        <div class="rounded-md shadow bg-white mb-2">
            <h1 class="text-lg p-4 font-bold">Color Channels</h1>
            <hr />
            {#each aip.entries as entry}
                <ColorPanel color={entry} on:colorChanged={updateAip} />
            {/each}
        </div>
    </div>
</div>

