<script>
  import Input from "./Input.svelte";
  import Editable from "./Editable.svelte";

  export let keymap;
  export let locale;
  export let processor;
  export let firmware;
  export let username;
  export let hostname;
  export let partitionDevice;
  export let partitionBoot;
  export let partitionRoot;
  export let editor;

  const AURMAN_PGP = "465022E743D71E39";

  $: isUEFI = firmware === "UEFI";
</script>

<style>
  article {
    margin-top: 1rem;
    column-count: 3;
    column-width: 25em;
    column-gap: 5rem;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  pre {
    color: rgba(0, 0, 0, 0.7);
    margin: 0;
    margin-left: 2rem;
  }
  h3,
  h4 {
    margin-bottom: 0;
    margin-top: 1.2em;
  }
  h3:first-child,
  h4:first-child {
    margin-top: 0;
  }
</style>

<article>
  <h3>Pre-installation (live environment)</h3>
  <ol>
    <Input name={`Set keyboard layout`}>
      loadkeys
      <Editable value={keymap} />
    </Input>
    {#if isUEFI}
      <Input name="Verify EFI boot mode">
        ls /sys/firmware/efi/efivars
        <p slot="text">
          If the directory does not exist, you need to find a way to reboot into
          EFI boot mode
        </p>
      </Input>
    {/if}
    <Input name="Update system clock">timedatectl set-ntp true</Input>
    <Input name="Partition the disks">
      {isUEFI ? 'gdisk' : 'fdisk'} <Editable value={partitionDevice} />
      <p slot="text">
        Example: {partitionBoot} EFI partition 550 MiB, {partitionRoot} linux
        partition remaining space
      </p>
    </Input>
    {#if isUEFI}
      <Input name="Format EFI partition">
        mkfs.fat -F32
        <Editable value={partitionBoot} />
      </Input>
    {/if}
    <Input name="Format root partition">
      mkfs.btrfs <Editable value={partitionRoot} />
      <p slot="text">Use whatever file system you wish</p>
    </Input>
    <Input name="Mount root file system">
      mount <Editable value={partitionRoot} /> /mnt
    </Input>
    {#if isUEFI}
      <Input name="Create EFI mount point">mkdir /mnt/boot</Input>
      <Input name="Mount EFI file system">
        mount <Editable value={partitionBoot} /> /mnt/boot
      </Input>
    {/if}
  </ol>
  <h3>Installation</h3>
  <ol>
    <Input name="Install pacman tools">pacman -Sy pacman-contrib</Input>
    <Input>
      curl -Ls
      "https://www.archlinux.org/mirrorlist/?country=DK&country=DE&country=NL&country=SE&protocol=https&ip_version=4&ip_version=6&use_mirror_status=on"
      | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 - >
      /etc/pacman.d/mirrorlist
      <p slot="text">
        This monster fetches nearby mirrors, ranks them and persists them in
        config (which will also be copied over during the following command). It
        takes a while, grab a coffee. If you dare, this is a shortened url:
        https://1n.pm/mirrorlist
      </p>
    </Input>
    <Input name="Install base packages">
      pacstrap /mnt base base-devel linux
      <Editable value={editor} />
      {#if isUEFI}
        <Editable value={`${processor.toLowerCase()}‑ucode`} />
      {/if}
    </Input>
  </ol>
  <h3>Configuration</h3>
  <ol>
    <Input name="Generate fstab file">genfstab -U /mnt >> /mnt/etc/fstab</Input>
    <Input name="Change root into new system">arch-chroot /mnt</Input>
    <Input name="Set root password">passwd</Input>
    <Input name="Set default editor">
      echo 'EDITOR=<Editable value={editor} />' >> /etc/environment
    </Input>
  </ol>
  <h4>Localization</h4>
  <ol>
    <Input name="Uncomment locales to generate">
      {editor} /etc/locale.gen
      <pre>
        {`${locale}.UTF-8 UTF-8
en_US.UTF-8 UTF-8`}
      </pre>
    </Input>
    <Input name="Generate locales">locale-gen</Input>
    <Input name="Set LANG, KEYMAP, timezone">
      <pre>
        <code>
systemd-firstboot \
  --locale=<Editable value={locale} />.UTF-8 \
  --keymap=<Editable value={keymap} /> \
  --timezone=<Editable value="Europe/Copenhagen" /> \
  --hostname=<Editable value={hostname} />
        </code>
      </pre>
    </Input>
    <Input name="Write software UTC time to hardware">hwclock --systohc</Input>
  </ol>
  <h4>Networking</h4>
  <ol>
    <Input name="Configure hosts file">
      <Editable value={editor} /> /etc/hosts
      <pre>
        <code>
          {`127.0.0.1\tlocalhost
::1\t\tlocalhost`}
        </code>
      </pre>
    </Input>
  </ol>
  <h4>Bootloader</h4>
  {#if isUEFI}
    <ol>
      <Input name="Install bootloader">bootctl install</Input>
      <Input name="Configure bootloader">
        <Editable value={editor} /> /boot/loader/entries/arch.conf
        <pre>
          <code>
title Arch Linux
linux /vmlinuz-linux
initrd /<Editable value={processor.toLowerCase()} />-ucode.img
initrd /initramfs-linux.img
options root=<Editable value={partitionRoot} /> rw
          </code>
        </pre>
        <p slot="text">
          You can also edit /boot/loader/loader.conf to increase timeout if you
          are dual booting-windows (otherwise you will boot directly to linux)
        </p>
      </Input>
      <h4>Reboot into new system</h4>
      <Input name="Leave chroot">exit</Input>
      <Input name="Unmount and reboot">umount -R /mnt && reboot</Input>
    </ol>
  {:else}
    <ol>
      <Input name="Install GRUB">pacman -Syu grub</Input>
      <Input name="Install bootloader">
        grub install --target=i386-pc <Editable value={partitionDevice} />
      </Input>
      <Input name="Configure bootloader">
        grub-mkconfig -o /boot/grub/grub.cfg
      </Input>
      <h4>Reboot into new system</h4>
      <Input name="Leave chroot">exit</Input>
      <Input name="Unmount and reboot">umount -R /mnt && reboot</Input>
    </ol>
  {/if}
  <h3>Userspace setup</h3>
  <ol>
    <Input name="Create regular user">
      useradd --create-home --groups wheel <Editable value={username} />
    </Input>
    <Input name="Set user password">passwd <Editable value={username} /></Input>
    <Input name="Enable sudo for wheel group">
      visudo
      <pre>
        <code>%wheel ALL (ALL) ALL</code>
      </pre>
      <p slot="text">
        Uncomment the above line to allow members of group wheel to execute any
        command if they give root password
      </p>
    </Input>
    <Input name="Change to regular user">su <Editable value={username} /></Input>
  </ol>
  <h4>Install aurman</h4>
  <ol>
    <Input>
      curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz
    </Input>
    <Input name="Import GnuPG key">gpg --recv-keys {AURMAN_PGP}</Input>
    <Input name="Unpack">tar -xvf aurman.tar.gz</Input>
    <Input>cd aurman</Input>
    <Input name="Compile and install">makepkg -si</Input>
  </ol>
  <h4>Install important AUR packages</h4>
  <ol>
    <Input>
      aurman -Syu spotify
      {#if isUEFI}systemd-boot-pacman-hook{/if}
      <p slot="text">
        {#if isUEFI}
          IMPORTANT: the bootctl update hook is needed to ensure microcode
          updates
        {/if}
      </p>
    </Input>
  </ol>
  <h4>Install all the good shit</h4>
  <ol>
    <Input>
      sudo pacman -Syu docker docker-compose openssh termite unzip ...
    </Input>
  </ol>
</article>
