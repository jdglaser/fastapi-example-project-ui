import React from "react";
import { useClientRequest } from "../hooks";

interface ScreenOverflayProps {
  isOn: boolean
}

export default function ScreenOverlayProps(props: ScreenOverflayProps) {
  const {overlayIsOn} = useClientRequest();

  return (
    <div className={`screen-overlay${overlayIsOn ? "" : " hidden"}`}>Hi!</div>
  )
}