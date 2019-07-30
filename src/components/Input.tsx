import React from "react";

interface Props {
  name?: any;
  text?: any;
  children: any;
}

export default ({ name, text, children }: Props) => (
  <li className="Input">
    {name && <h5>{name}</h5>}
    <code>{children}</code>
    {text && <p>{text}</p>}
  </li>
);
