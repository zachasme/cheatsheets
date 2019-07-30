import React, { ChangeEvent } from "react";

interface Props {
  name: string;
  options: object;
  value: string;
  onChange: any;
}

export default ({ name, options, value, onChange }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return (
    <>
      {Object.values(options).map(option => (
        <label key={option}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={option === value}
            onChange={handleChange}
          />
          {` ${option}`}
        </label>
      ))}
    </>
  );
};
