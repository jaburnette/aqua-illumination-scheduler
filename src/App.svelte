<script>
  import Load from "./Load.svelte";
  import Edit from "./Edit.svelte";
  import {parseXml} from "./parser";

  let phase = "load";

  let aipXml = null;
  let aipObj = null;
  let aip = null;

  $: if (aipXml) {
    aip = parseXml(aipXml);
    // stick it in localstorage to reload it later
    localStorage.setItem("aip", JSON.stringify(aip));
    phase = "edit";
  }

  $: if (aipObj) {
    aip = aipObj;
    localStorage.setItem("aip", JSON.stringify(aip));
    phase = "edit";
  }

  const reset = () => {
    localStorage.clear();
    aip = null;
    aipObj = null;
    aipXml = null;
    phase = "load";
  };

  // check localstorage and go straight to the editor if it's there
  if (localStorage.getItem("aip")) {
    try {
      aip = JSON.parse(localStorage.getItem("aip"));
      phase = "edit";
    } catch (e) {
      console.log(e);
      localStorage.clear();
    }
  }
</script>

<div class="px-4 md:px-0">
    {#if phase === "load"}
        <Load bind:aipXml={aipXml} bind:aipObj={aipObj} />
    {/if}

    {#if phase === "edit"}
        <Edit aip={aip} reset={reset} />
    {/if}
</div>
