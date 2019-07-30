import React, { useState } from "react";
import "./App.css";

import Installation from "./Installation";

import { Processor, Firmware } from "../types";

import EnumRadio from "./EnumRadio";

const App = () => {
  const [processor, setProcessor] = useState(Processor.AMD);
  const [firmware, setFirmware] = useState(Firmware.UEFI);

  const params = {
    username: useState("zach"),
    hostname: useState("ballz-pc"),
    partition_device: useState("/dev/sdX"),
    partition_efi: useState("/dev/sdX1"),
    partition_root: useState("/dev/sdX2")
  };

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
          {firmware === Firmware.UEFI && (
            <li>
              <EnumRadio
                name="processor"
                options={Processor}
                value={processor}
                onChange={setProcessor}
              />
            </li>
          )}
        </ol>
        {Object.entries(params).map(([name, [value, setValue]]) => (
          <input
            key={name}
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        ))}
      </div>
      <h1>Installation cheatsheet</h1>
      <div className="App">
        <Installation
          firmware={firmware}
          processor={processor}
          username={params["username"][0]}
          hostname={params["hostname"][0]}
          partition_device={params["partition_device"][0]}
          partition_efi={params["partition_efi"][0]}
          partition_root={params["partition_root"][0]}
        />
      </div>
    </>
  );
};

export default App;
