<script>
    let files;
    $: url = null;

    export let aip = null;

    $: if (files) {
        const aipFile = files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          aip = reader.result;
        });
        reader.readAsText(aipFile);
    }

</script>

<div class="w-1/2 bg-white rounded-md shadow p-4 mx-auto">
    <h1 class="text-2xl mb-4">Aquatic Illumination Light Editor</h1>
    <p class="mb-6">
        This utility will allow you to edit a .aip light schedule file.  You can either upload a file directly
        or enter a URL to grab from, for example, the Aquatic Illumination website.
    </p>
    <label for="file" class="block font-bold mb-2">Upload</label>
    <input type="file" id="file" bind:files />

    <label for="url" class="block font-bold mt-5 mb-2">Enter URL</label>
    <input id="url" type="text" class="border-2 rounded-md text-lg w-64 p-1" value="{url}" />
    <span class="bg-blue-800 text-white pt-2 pb-2 pl-5 pr-5 rounded">Go</span>
</div>