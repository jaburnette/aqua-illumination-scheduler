<script>
  import Load from "./Load.svelte";
  import Edit from "./Edit.svelte";
  import {parseXml} from "./parser";

  $: phase = "load";

  let aipXml = null;
  let aip = null;

  $: if (aipXml) {
    // stick it in localstorage to reload it later
    localStorage.setItem("aipXml", aipXml);
    phase = "edit";

    aip = parseXml(aipXml);
  }

  // check localstorage and go straight to the editor if it's there
  if (localStorage.getItem("aipXml"))
    aipXml = localStorage.getItem("aipXml");
</script>

<div>
    {#if phase === "load"}
        <Load bind:aip={aipXml} />
    {/if}

    {#if phase === "edit"}
        <Edit aip={aip} />
    {/if}
</div>
