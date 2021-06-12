import React from "react"

type TextInputType = "text" | "date" | "password"

interface TextInputProps<T extends TextInputType> {
  type: T
  value: string
  setValue(val: string): void
  label: string,
  error?: boolean,
  errorMessage?: string
}

export default function TextInput<T extends TextInputType>(props: TextInputProps<T>) {
  const {type, value, setValue, label, error, errorMessage} = props;

  return (
    <>
      <label style={{width: "fit-content"}}>{label}: </label>
        <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
          <input type={type}
                  value={value}
                  onChange={(evt) => setValue(evt.target.value)} />
          <div className="error">{error ? errorMessage : ""}</div>
        </div>
    </>
  )
}