import React from "react";

import Input from "./Input.js";

const AURMAN_PGP = "465022E743D71E39";

export default ({
  processor,
  hostname,
  username,
  partition_device,
  partition_efi,
  partition_root
}) => (
  <>
    <h3>Pre-installation (live environment)</h3>
    <ol>
      <Input name="Set keyboard layout">loadkeys dk</Input>
      <Input
        name="Verify EFI boot mode"
        text="If the directory does not exist, you need to find a way to reboot into EFI boot
        mode"
      >
        ls /sys/firmware/efi/efivars
      </Input>
      <Input name="Update system clock">timedatectl set-ntp true</Input>
      <Input
        name="Partition the disks"
        text={`Example: ${partition_efi} EFI partition 550 MiB, ${partition_root} linux partition remaining space`}
      >
        gdisk {partition_device}
      </Input>

      <Input name="Format EFI partition">mkfs.fat -F32 {partition_efi}</Input>
      <Input
        name="Format root partition"
        text="Use whatever file system you wish"
      >
        mkfs.btrfs {partition_root}
      </Input>
      <Input name="Mount root file system">mount {partition_root} /mnt</Input>
      <Input name="Create EFI mount point">mkdir /mnt/boot</Input>
      <Input name="Mount EFI file system">
        mount {partition_efi} /mnt/boot
      </Input>
    </ol>
    <h3>Installation</h3>
    <ol>
      <Input name="Install pacman tools">pacman -S pacman-contrib</Input>
      <Input text="This monster fetches nearby mirrors, ranks them and persists them in config (which will also be copied over during the following command). It takes a while, grab a coffee.">
        curl -s
        "https://www.archlinux.org/mirrorlist/?country=DK&country=DE&country=NL&country=SE&protocol=https&ip_version=4&ip_version=6&use_mirror_status=on"
        | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 - >
        /etc/pacman.d/mirrorlist
      </Input>
      <Input name="Install base packages">
        pacstrap /mnt base base-devel {processor}-ucode
      </Input>
    </ol>
    <h3>Configuration</h3>
    <ol>
      <Input name="Generate fstab file">
        genfstab -U /mnt >> /mnt/etc/fstab
      </Input>
      <Input name="Change root into new system">arch-chroot /mnt</Input>
    </ol>
    <h4>Localization</h4>
    <ol>
      <Input name="Set the time zone">
        ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime
      </Input>
      <Input name="Write software UTC time to hardware">
        hwclock --systohc
      </Input>
      <Input name="Uncomment locales to generate">
        nano /etc/locale.gen
        <pre>
          <code>
            {`en_DK.UTF-8 UTF-8
en_US.UTF-8 UTF-8`}
          </code>
        </pre>
      </Input>
      <Input name="Generate locales">locale-gen</Input>
      <Input name="Set LANG">echo 'LANG=en_DK.UTF-8' > /etc/locale.conf</Input>
      <Input name="Persist keymap">echo 'KEYMAP=dk' > /etc/vconsole.conf</Input>
    </ol>{" "}
    <h4>Networking</h4>
    <ol>
      <Input name="Set hostname">echo '{hostname}' > /etc/hostname</Input>
      <Input name="Configure hosts file">
        nano /etc/hosts
        <pre>
          <code>
            {`127.0.0.1\tlocalhost
::1\t\tlocalhost`}
          </code>
        </pre>
      </Input>
    </ol>
    <h4>Password & bootloader</h4>
    <ol>
      <Input name="Set root password">passwd</Input>
      <Input name="Install bootloader">bootctl install</Input>
      <Input
        name="Configure bootloader"
        text="You can also edit /boot/loader/loader.conf to increase timeout if you are dual booting-windows (otherwise you will boot directly to linux)"
      >
        nano /boot/loader/entries/arch.conf
        <pre>
          <code>
            {`title Arch Linux
linux /vmlinuz-linux
initrd /${processor}-ucode.img
initrd /initramfs-linux.img
options root=${partition_root} rw`}
          </code>
        </pre>
      </Input>
      <Input name="Reboot into new system">
        exit && umount -R /mnt && reboot
      </Input>
    </ol>
    <h3>Userspace setup</h3>
    <ol>
      <Input
        name="Create regular user"
        text="wheel is for sudo, audio is for audio"
      >
        useradd --create-home --groups audio wheel {username}
      </Input>
      <Input name="Set user password">passwd {username}</Input>
      <Input name="Enable sudo for wheel group">visudo</Input>
      <Input name="Change to regular user">su {username}</Input>
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
      <Input name="IMPORTANT: bootctl update hook">
        aurman -Syu systemd-boot-pacman-hook
      </Input>
    </ol>
    <h4>Install all the good shit</h4>
    <ol>
      <Input>
        sudo pacman -Syu docker docker-compose openssh termite unzip ...
      </Input>
    </ol>
  </>
);
