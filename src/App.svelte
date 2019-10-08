<script>
  import Installation from "./components/Installation.svelte";
  import EnumRadio from "./components/EnumRadio.svelte";

  let keymap = "dk";
  let locale = "en_DK";
  let processor = "AMD";
  let firmware = "UEFI";
  let username = "zach";
  let hostname = "ballz-pc";
  let partitionDevice = "/dev/sdX";
  let partitionBoot = "/dev/sdX1";
  let partitionRoot = "/dev/sdX2";
  let editor = "vim";

  $: isUEFI = firmware === "UEFI";
</script>

<style>
  @media print {
    .controls {
      display: none;
    }
  }
</style>

<div>
  <ol class="controls">
    <li>
      <EnumRadio options={['UEFI', 'BIOS']} bind:value={firmware} />
    </li>
    <li>
      <EnumRadio options={['AMD', 'Intel']} bind:value={processor} />
    </li>
    <li>
      <EnumRadio options={['vim', 'nano']} bind:value={editor} />
    </li>
    <li>
      <label>
        Keymap
        <input bind:value={keymap} />
      </label>
    </li>
    <li>
      <label>
        Locale
        <input bind:value={locale} />
      </label>
    </li>
    <li>
      <label>
        Username
        <input bind:value={username} />
      </label>
    </li>
    <li>
      <label>
        Hostname
        <input bind:value={hostname} />
      </label>
    </li>
    <li>
      <label>
        Partition Device
        <input bind:value={partitionDevice} />
      </label>
    </li>
    <li>
      <label>
        Partition Root
        <input bind:value={partitionRoot} />
      </label>
    </li>
    {#if isUEFI}
      <li>
        <label>
          Partition Boot
          <input bind:value={partitionBoot} />
        </label>
      </li>
    {/if}
  </ol>
  <Installation
    {keymap}
    {locale}
    {firmware}
    {processor}
    {username}
    {hostname}
    {partitionDevice}
    {partitionBoot}
    {partitionRoot}
    {editor} />
</div>
