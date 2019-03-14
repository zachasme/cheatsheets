import React from "react";

export default ({ name, text, children }) => (
  <li className="Input">
    {name && <h5>{name}</h5>}
    <code>{children}</code>
    {text && <p>{text}</p>}
  </li>
);
