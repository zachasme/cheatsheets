<script>
  export let options;

  export let value = "";
</script>

{#each options as option}
  <label>
    <input type="radio" bind:group={value} value={option} />
    {option}
  </label>
{/each}
