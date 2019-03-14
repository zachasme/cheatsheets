import React, { useState } from "react";
import "./App.css";

import Installation from "./Installation.js";
import UserSpaceSetup from "./UserSpaceSetup.js";

const App = () => {
  const [processor, setProcessor] = useState("amd");

  const params = {
    username: useState("zach"),
    hostname: useState("ballz-pc"),
    partition_device: useState("/dev/sdX"),
    partition_efi: useState("/dev/sdX1"),
    partition_root: useState("/dev/sdX2")
  };

  function handleProcessor(event) {
    setProcessor(event.target.value);
  }

  return (
    <>
      <div className="controls" style={{ marginBottom: "2rem" }}>
        <label>
          <input
            type="radio"
            name="processor"
            value="intel"
            checked={processor === "intel"}
            onChange={handleProcessor}
          />{" "}
          Intel
        </label>
        <label>
          <input
            type="radio"
            name="processor"
            value="amd"
            checked={processor === "amd"}
            onChange={handleProcessor}
          />{" "}
          AMD
        </label>
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
          processor={processor}
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

export default App;
