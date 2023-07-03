<script>
    let files;
    let url;

    export let aipXml = null;
    /** @property {aip} aip **/
    export let aipObj = null;

    $: if (files) {
        const aipFile = files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => aipXml = reader.result);
        reader.readAsText(aipFile);
    }

    const startFromScratch = () => {
        aipObj = {
          checksum: "",
          version: 2,
          entries: [
            {name: "deep_red", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "uv", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "violet", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "cool_white", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "green", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "blue", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
            {name: "royal", values:
                [
                  {time: 0, intensity: 0},
                  {time: 1439, intensity: 0},
                ]
            },
          ],
        };
    };

</script>

<div class="md:w-1/2 bg-white rounded-md shadow p-4 mx-auto">
    <h1 class="text-2xl mb-4">Aqua Illumination Light Schedule Editor</h1>
    <p class="mb-6">
        This utility will allow you to create or edit a .aip light schedule file.  If you don't want to start from scratch, you can grab
        prebuilt AIP files from
        <a class="underline" href="https://www.aquaillumination.com/lightsciences/signature-series">the Aqua Illumination website</a>.
    </p>
    <label for="file" class="block font-bold mb-2">Upload a file</label>
    <input type="file" id="file" bind:files />
    <br />
    <span class="inline-block mt-8 bg-blue-800 text-white pt-2 pb-2 pl-5 pr-5 rounded cursor-pointer" on:click={startFromScratch}>Start From Scratch</span>
</div>