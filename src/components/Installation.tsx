import React from "react";

import Input from "./Input";

import { Processor, Firmware, Editor, FileSystem, Kernel } from "../types";

const AURMAN_PGP = "465022E743D71E39";

interface Props {
  editor: Editor;
  kernel: Kernel;
  fileSystem: FileSystem;
  processor: Processor;
  firmware: Firmware;
  hostname: any;
  username: any;
  partitionDevice: any;
  partitionBoot: any;
  partitionRoot: any;
}

export default ({
  editor,
  kernel,
  fileSystem,
  processor,
  firmware,
  hostname,
  username,
  partitionDevice,
  partitionBoot,
  partitionRoot,
}: Props) => {
  const isUEFI = firmware === Firmware.UEFI;

  const strapPackages = [kernel, editor, "base", "base-devel"];
  const aurPackages = [];
  const userPackages = ["xorg", "docker", "openssh", "termite"];

  if (isUEFI) {
    strapPackages.push(`${processor.toLowerCase()}‑ucode`);
    aurPackages.push("systemd-boot-pacman-hook");
  }

  return (
    <>
      <h3>Pre-installation (live environment)</h3>
      <ol>
        <Input name={`Set keyboard layout`}>loadkeys dk</Input>
        {isUEFI && (
          <Input
            name="Verify EFI boot mode"
            text="If the directory does not exist, you need to find a way to reboot into EFI boot
        mode"
          >
            ls /sys/firmware/efi/efivars
          </Input>
        )}
        <Input name="Update system clock">timedatectl set-ntp true</Input>
        <Input
          name="Partition the disks"
          text={`Example: ${partitionBoot} EFI partition 550 MiB, ${partitionRoot} ${kernel} partition remaining space`}
        >
          {isUEFI ? "gdisk" : "fdisk"} {partitionDevice}
        </Input>
        {isUEFI && (
          <Input
            name="Format EFI partition"
            text="IMPORTANT: Refer to the wiki if you are dual booting, formatting your EFI partition will most likely make Windows unbootable"
          >
            mkfs.fat -F32 {partitionBoot}
          </Input>
        )}
        <Input name="Format root partition">
          mkfs.{fileSystem} {partitionRoot}
        </Input>
        <Input name="Mount root file system">mount {partitionRoot} /mnt</Input>
        {isUEFI && (
          <>
            <Input name="Create EFI mount point">mkdir /mnt/boot</Input>
            <Input name="Mount EFI file system">
              mount {partitionBoot} /mnt/boot
            </Input>
          </>
        )}
      </ol>
      <h3>Installation</h3>
      <ol>
        <Input
          name="Choose download mirrors"
          text="The higher a mirror is placed in the list, the more priority it is given when downloading a package. You may want to edit the file accordingly, and move the geographically closest mirrors to the top of the list, although other criteria should be taken into account. This file will later be copied to the new system by pacstrap, so it is worth getting right. "
        >
          {editor} /etc/pacman.d/mirrorlist
        </Input>
        <Input
          name="Install base packages"
          text="NOTE: If you are fucked, it might help to install linux-firmware"
        >
          pacstrap /mnt {strapPackages.join(" ")}
        </Input>
      </ol>
      <h3>Configuration</h3>
      <ol>
        <Input name="Generate fstab file">
          genfstab -U /mnt &gt;&gt; /mnt/etc/fstab
        </Input>
        <Input name="Change root into new system">arch-chroot /mnt</Input>
        <Input name="Set root password">passwd</Input>
        <Input name="Set default editor">
          echo 'EDITOR={editor}' &gt;&gt; /etc/environment
        </Input>
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
          {editor} /etc/locale.gen
          <pre>
            <code>
              {`en_DK.UTF-8 UTF-8
en_US.UTF-8 UTF-8`}
            </code>
          </pre>
        </Input>
        <Input name="Generate locales">locale-gen</Input>
        <Input name="Set LANG">
          echo 'LANG=en_DK.UTF-8' &gt; /etc/locale.conf
        </Input>
        <Input name="Persist keymap">
          echo 'KEYMAP=dk' &gt; /etc/vconsole.conf
        </Input>
      </ol>{" "}
      <h4>Networking</h4>
      <ol>
        <Input name="Set hostname">echo '{hostname}' &gt; /etc/hostname</Input>
        <Input name="Configure hosts file">
          {editor} /etc/hosts
          <pre>
            <code>
              {`127.0.0.1\tlocalhost
::1\t\tlocalhost`}
            </code>
          </pre>
        </Input>
      </ol>
      <h4>Bootloader</h4>
      {isUEFI ? (
        <ol>
          <Input name="Install bootloader">bootctl install</Input>
          <Input
            name="Read UUID of root partition"
            text="You will need this for the next step"
          >
            lsblk -dno UUID {partitionRoot}
          </Input>
          <Input
            name="Configure bootloader"
            text="You can also edit /boot/loader/loader.conf to increase timeout if you are dual booting-windows (otherwise you will boot directly to linux)"
          >
            {editor} /boot/loader/entries/arch.conf
            <pre>
              <code>
                {`title Arch Linux (${kernel})
linux /vmlinuz-${kernel}
initrd /${processor.toLowerCase()}-ucode.img
initrd /initramfs-${kernel}.img
options root="UUID=put-here-the-uuid-you-got-above" rw`}
              </code>
            </pre>
          </Input>
          <h4>Reboot into new system</h4>
          <Input name="Leave chroot">exit</Input>
          <Input name="Unmount and reboot">umount -R /mnt && reboot</Input>
        </ol>
      ) : (
        <ol>
          <Input name="Install GRUB">pacman -Syu grub</Input>
          <Input name="Install bootloader">
            grub install --target=i386-pc {partitionDevice}
          </Input>
          <Input name="Configure bootloader">
            grub-mkconfig -o /boot/grub/grub.cfg
          </Input>
          <h4>Reboot into new system</h4>
          <Input name="Leave chroot">exit</Input>
          <Input name="Unmount and reboot">umount -R /mnt && reboot</Input>
        </ol>
      )}
      <h3>Userspace setup</h3>
      <ol>
        <Input name="Create regular user" text="The `wheel` group is for sudo">
          useradd --create-home --groups wheel {username}
        </Input>
        <Input name="Set user password">passwd {username}</Input>
        <Input
          name="Enable sudo for wheel group"
          text="Uncomment the above to allow members of group `wheel` to execute any command (after entering root password)"
        >
          visudo
          <pre>
            <code>%wheel ALL=(ALL) ALL</code>
          </pre>
        </Input>
        <Input name="Change to regular user">su {username}</Input>
      </ol>
      <h4>Install aurman</h4>
      <ol>
        <Input>
          curl -L -O
          https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz
        </Input>
        <Input name="Import GnuPG key">gpg --recv-keys {AURMAN_PGP}</Input>
        <Input name="Unpack">tar -xvf aurman.tar.gz</Input>
        <Input>cd aurman</Input>
        <Input name="Compile and install">makepkg -si</Input>
      </ol>
      {aurPackages.length > 0 && (
        <>
          <h4>Install important AUR packages</h4>
          <ol>
            <Input
              text={
                isUEFI &&
                "IMPORTANT: the bootctl update hook is needed to ensure microcode updates"
              }
            >
              aurman -Syu {aurPackages.join(" ")}
            </Input>
          </ol>
        </>
      )}
      <h4>Install all the good shit</h4>
      <ol>
        <Input>sudo pacman -Syu {userPackages.join(" ")} ...</Input>
      </ol>
    </>
  );
};
