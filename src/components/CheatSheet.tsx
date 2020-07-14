import React, { useState } from "react";

import Installation from "./Installation";

import { Kernel, Editor, Processor, Firmware, FileSystem } from "../types";

import EnumRadio from "./EnumRadio";

const App = () => {
  const [fileSystem, setFileSystem] = useState(FileSystem.EXT4);
  const [processor, setProcessor] = useState(Processor.AMD);
  const [firmware, setFirmware] = useState(Firmware.UEFI);
  const [kernel, setKernel] = useState(Kernel.LINUX);
  const [editor, setEditor] = useState(Editor.VIM);
  const [username, setUsername] = useState("zach");
  const [hostname, setHostname] = useState("ballz-pc");
  const [partitionDevice, setPartitionDevice] = useState("/dev/nvme0n1p");
  const [partitionBoot, setPartitionBoot] = useState("/dev/nvme0n1p1");
  const [partitionRoot, setPartitionRoot] = useState("/dev/nvme0n1p2");

  const settings = [
    {
      label: "Username",
      name: "username",
      value: username,
      setValue: setUsername,
    },
    {
      label: "Hostname",
      name: "hostname",
      value: hostname,
      setValue: setHostname,
    },
    {
      label: "Partition Device",
      name: "partition_device",
      value: partitionDevice,
      setValue: setPartitionDevice,
    },
    {
      label: "Partition Root",
      name: "partition_root",
      value: partitionRoot,
      setValue: setPartitionRoot,
    },
  ];

  const isUEFI = firmware === Firmware.UEFI;

  if (isUEFI)
    settings.push({
      label: "Partition Boot",
      name: "partition_boot",
      value: partitionBoot,
      setValue: setPartitionBoot,
    });

  return (
    <>
      <div className="controls" style={{ marginBottom: "2rem" }}>
        <h2>Settings</h2>
        <ol style={{ display: "flex", flexWrap: "wrap" }}>
          <li>
            <EnumRadio
              wiki="Unified_Extensible_Firmware_Interface"
              legend="Firwmare"
              name="firmware"
              options={Firmware}
              value={firmware}
              onChange={setFirmware}
            />
          </li>
          {isUEFI && (
            <li>
              <EnumRadio
                wiki="Microcode"
                legend="Processor"
                name="processor"
                options={Processor}
                value={processor}
                onChange={setProcessor}
              />
            </li>
          )}
          <li>
            <EnumRadio
              wiki="Category:Text_editors"
              legend="Editor"
              name="editor"
              options={Editor}
              value={editor}
              onChange={setEditor}
            />
          </li>
          <li>
            <EnumRadio
              wiki="File_systems"
              legend="File system"
              name="file_system"
              options={FileSystem}
              value={fileSystem}
              onChange={setFileSystem}
            />
          </li>
          <li>
            <EnumRadio
              wiki="Kernel"
              legend="Kernel"
              name="kernel"
              options={Kernel}
              value={kernel}
              onChange={setKernel}
            />
          </li>
        </ol>
        <ol style={{ display: "flex", flexWrap: "wrap" }}>
          {settings.map(({ label, name, value, setValue }) => (
            <li key={name}>
              <label>
                {label}
                <br />
                <input
                  key={name}
                  name={name}
                  type="text"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </label>
            </li>
          ))}
        </ol>
      </div>
      <h1>Installation cheatsheet</h1>
      <div className="App">
        <Installation
          fileSystem={fileSystem}
          processor={processor}
          firmware={firmware}
          editor={editor}
          kernel={kernel}
          username={username}
          hostname={hostname}
          partitionDevice={partitionDevice}
          partitionBoot={partitionBoot}
          partitionRoot={partitionRoot}
        />
      </div>
    </>
  );
};

export default App;
