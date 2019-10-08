<script>
  export let name = null;
</script>

<style>
  li {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.02) 100%
    );
    margin: 0.5rem 0;
    padding: 0.5rem;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    transition: all 0.2s ease-out;
  }
  li:hover {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.045) 100%
    );
    transform: translateX(0.4rem);
  }
  li > li {
    margin-left: 2rem;
  }
  code {
    flex: 1;
  }
  li h5 {
    margin: 0;
    color: rgba(0, 0, 0, 0.6);
  }
  li :global(p) {
    margin: 0;
    width: 100%;
    flex-basis: 100%;
    color: rgba(0, 0, 0, 0.8);
    padding: 0 0.5rem;
    padding-top: 0.5rem;
  }
</style>

<li className="Input">
  {#if name}
    <h5>{name}</h5>
  {/if}
  <code>
    <slot />
  </code>
  <slot name="text" />
</li>
