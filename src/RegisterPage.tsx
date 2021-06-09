import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ClientRequest, useClientRequest } from "./hooks";
import TextInput from "./TextInput";
import { Optional, UserTemplate } from "./types";

export default function RegisterPage() {
  const {clientRequest, register} = useClientRequest();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<Optional<string>>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<Optional<string>>(null);

  const history = useHistory();

  async function onRegister() {
    const user: UserTemplate = {
      username,
      password,
      firstName,
      lastName,
      dateOfBirth,
      email
    }

    const {res, error} = await register(user);
    if (error) {
      setErrorMessage(error.message)
    }
  }

  const valid = password === confirmPassword && 
    password.trim() !== "" &&
    username.trim() !== "" &&
    firstName.trim() !== "" &&
    email.trim() !== "" &&
    dateOfBirth !== "";

  return (
    <>
      <div className="error">{errorMessage}</div>
      <div className="register form">
          <TextInput type="text"
                     value={username}
                     setValue={setUsername}
                     label="Username" />
          <TextInput type="password"
                     value={password}
                     setValue={setPassword}
                     label="Password" />
          <TextInput type="password"
                     value={confirmPassword}
                     setValue={setConfirmPassword}
                     label="Confirm Password" />
          <TextInput type="text"
                     value={firstName}
                     setValue={setFirstName}
                     label="First Name" />
          <TextInput type="text"
                     value={lastName ?? ""}
                     setValue={setLastName}
                     label="Last Name" />
          <TextInput type="text"
                     value={email}
                     setValue={setEmail}
                     label="Email" />
          <TextInput type="date"
                     value={dateOfBirth}
                     setValue={setDateOfBirth}
                     label="Date" />
          <button onClick={onRegister}
                  disabled={valid !== true}>Register</button>
      </div>
    </>
  )
}