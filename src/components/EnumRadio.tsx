import React, { ChangeEvent } from "react";

interface Props {
  legend: string;
  name: string;
  options: object;
  value: string;
  onChange: any;
  wiki?: string;
}

export default ({ wiki, legend, name, options, value, onChange }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return (
    <fieldset>
      <legend>
        {wiki ? (
          <a href={`https://wiki.archlinux.org/index.php/${wiki}`}>{legend}</a>
        ) : (
          legend
        )}
      </legend>
      {Object.values(options).map((option) => (
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
    </fieldset>
  );
};
