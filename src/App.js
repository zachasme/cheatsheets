import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const PARAMS = ["username", "hostname"];

const Input = ({ text, children }) => (
  <li className="Input">
    {text && <p>{text}</p>}
    <code>{children}</code>
  </li>
);

const App = () => {
  const params = {
    username: useState("$USER"),
    hostname: useState("$HOSTNAME"),
    partition_device: useState("/dev/sdX"),
    partition_efi: useState("/dev/sdX1"),
    partition_root: useState("/dev/sdX2")
  };
  return (
    <>
      <div>
        {Object.entries(params).map(([name, [value, setValue]]) => (
          <input
            key={name}
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        ))}
      </div>
      <div className="App">
        <Cheatsheet
          {...Object.assign(
            ...Object.entries(params).map(([name, [value]]) => ({
              [name]: value
            }))
          )}
        />
      </div>
    </>
  );
};

const Cheatsheet = ({
  hostname,
  username,
  partition_device,
  partition_efi,
  partition_root
}) => (
  <>
    <h3>Pre-installation (live environment)</h3>
    <ol>
      <p>Boot live env</p>
      <Input text="Set keyboard layout">loadkeys dk</Input>
      <Input text="Verify EFI boot mode">ls /sys/firmware/efi/efivars</Input>
      <Input text="Update system clock">timedatectl set-ntp true</Input>
      <Input text="Partition the disks">
        gdisk {partition_device}
        <ol>
          <Input>o</Input>
          <Input>n</Input>
          <Input>[default=1]</Input>
          <Input>[default=2048]</Input>
          <Input>+550M</Input>
          <Input>EF00</Input>
          <Input>n</Input>
          <Input>[default=2]</Input>
          <Input>[default=...]</Input>
          <Input>MAKE IT BIG</Input>
          <Input>[default=8300]</Input>
          <Input>w</Input>
        </ol>
      </Input>

      <Input text="Format EFI partition">mkfs.fat -F32 {partition_efi}</Input>
      <Input text="Format root partition">mkfs.btrfs {partition_root}</Input>
      <Input text="Mount root file system">mount {partition_root} /mnt</Input>
      <Input>mkdir /mnt/boot</Input>
      <Input text="Mount efi file system">
        mount {partition_efi} /mnt/boot
      </Input>
    </ol>
    <h3>Installation</h3>
    <ol>
      <Input>pacman -S pacman-contrib</Input>
      <Input>
        curl -s
        "https://www.archlinux.org/mirrorlist/?country=DK&country=DE&country=NL&country=SE&protocol=https&ip_version=4&ip_version=6&use_mirror_status=on"
        | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 5 - >
        /etc/pacman.d/mirrorlist
      </Input>
      <Input>pacstrap /mnt base base-devel openssh amd-ucode</Input>
      <Input>Configuration</Input>
      <Input>genfstab -U /mnt >> /mnt/etc/fstab</Input>
      <Input>arch-chroot /mnt</Input>
      <Input>ln -sf /usr/share/zoneinfo/Europe/Copenhagen /etc/localtime</Input>
      <Input>echo 'en_DK.UTF-8 UTF-8' >> /etc/locale.gen</Input>
      <Input>echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen</Input>
      <Input>locale-gen</Input>
      <Input>echo 'LANG=en_DK.UTF-8' > /etc/locale.conf</Input>
      <Input>echo 'KEYMAP=dk' > /etc/vconsole.conf</Input>
      <Input>echo '{hostname}' > /etc/hostname</Input>
      <Input>echo '127.0.0.1 localhost' >> /etc/hosts</Input>
      <Input>echo '::1 localhost' >> /etc/hosts</Input>
      <Input>passwd</Input>
      <Input>bootctl install</Input>
      <Input>
        nano /boot/loader/entries/arch.conf
        <ol>
          <Input>title Arch Linux</Input>
          <Input>linux /vmlinuz-linux</Input>
          <Input>initrd /amd-ucode.img</Input>
          <Input>initrd /initramfs-linux.img</Input>
          <Input>options root={partition_root} rw</Input>
        </ol>
      </Input>
      <Input>exit && umount -R /mnt && reboot</Input>
    </ol>
    <h3>Reboot</h3>
    <ol>
      <Input>useradd --create-home --groups wheel {username}</Input>
      <Input>passwd {username}</Input>
      <Input>visudo</Input> SETUP SUDO Logout and login as regular user aurman:
      curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/aurman.tar.gz
      tar -xvf aurman.tar.gz cd aurman gpg --recv-keys [enter missing key]
      makepkg -si aurman -Syu systemd-boot-pacman-hook
    </ol>
  </>
);

export default App;
