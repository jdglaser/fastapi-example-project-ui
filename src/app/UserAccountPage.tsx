import moment from "moment";
import React from "react";
import { useClientRequest } from "../hooks";

export default function UserAccountPage() {
  const {currentUser, logout} = useClientRequest()

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
      <h2>My Account</h2>
      <div style={{display: "grid",
                   width: "fit-content",
                   gridTemplateColumns: "auto auto",
                   gap: "5px 10px"}}>
        <div>Username:</div><div>{currentUser.username}</div>
        <div>First Name:</div><div>{currentUser.firstName}</div>
        <div>Last Name:</div><div>{currentUser.lastName}</div>
        <div>Email:</div><div>{currentUser.email}</div>
        <div>Birthday:</div><div>{moment(currentUser.dateOfBirth).format("MMM Do, YYYY")}</div>
      </div>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}