import moment from "moment";
import React from "react";
import { useClientRequest } from "./hooks";

export default function UserAccountPage() {
  const {currentUser} = useClientRequest()

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <h2>My Account</h2>
      <div>
        Username: {currentUser.username}<br/>
        First Name: {currentUser.firstName}<br/>
        Last Name: {currentUser.lastName}<br/>
        Email: {currentUser.email}<br/>
        Birthday: {moment(currentUser.dateOfBirth).format("MMM Do, YYYY")}
      </div>
    </>
  )
}