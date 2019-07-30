import React, { useState } from "react";

import Installation from "./Installation";

import { Processor, Firmware } from "../types";

import EnumRadio from "./EnumRadio";

const App = () => {
  const [processor, setProcessor] = useState(Processor.AMD);
  const [firmware, setFirmware] = useState(Firmware.UEFI);
  const [username, setUsername] = useState("zach");
  const [hostname, setHostname] = useState("ballz-pc");
  const [partitionDevice, setPartitionDevice] = useState("/dev/sdX");
  const [partitionBoot, setPartitionBoot] = useState("/dev/sdX1");
  const [partitionRoot, setPartitionRoot] = useState("/dev/sdX2");

  const settings = [
    {
      label: "Username",
      name: "username",
      value: username,
      setValue: setUsername
    },
    {
      label: "Hostname",
      name: "hostname",
      value: hostname,
      setValue: setHostname
    },
    {
      label: "Partition Device",
      name: "partition_device",
      value: partitionDevice,
      setValue: setPartitionDevice
    },
    {
      label: "Partition Root",
      name: "partition_root",
      value: partitionRoot,
      setValue: setPartitionRoot
    }
  ];

  const isUEFI = firmware === Firmware.UEFI;

  if (isUEFI)
    settings.push({
      label: "Partition Boot",
      name: "partition_boot",
      value: partitionBoot,
      setValue: setPartitionBoot
    });

  return (
    <>
      <div className="controls" style={{ marginBottom: "2rem" }}>
        <ol>
          <li>
            <EnumRadio
              name="firmware"
              options={Firmware}
              value={firmware}
              onChange={setFirmware}
            />
          </li>
          {isUEFI && (
            <li>
              <EnumRadio
                name="processor"
                options={Processor}
                value={processor}
                onChange={setProcessor}
              />
            </li>
          )}

          {settings.map(({ label, name, value, setValue }) => (
            <li key={name}>
              <label>
                {label}
                <input
                  key={name}
                  name={name}
                  type="text"
                  value={value}
                  onChange={event => setValue(event.target.value)}
                />
              </label>
            </li>
          ))}
        </ol>
      </div>
      <h1>Installation cheatsheet</h1>
      <div className="App">
        <Installation
          firmware={firmware}
          processor={processor}
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
