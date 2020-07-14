import React, { useState } from "react";

interface Props {
  name?: any;
  text?: any;
  children: any;
}

export default ({ name, text, children }: Props) => {
  const [checked, setChecked] = useState(false);
  return (
    <li
      className={`Input ${checked && "checked"}`}
      onClick={() => setChecked((checked) => !checked)}
    >
      {name && <h5>{name}</h5>}
      <code>{children}</code>
      {text && <p>{text}</p>}
    </li>
  );
};
