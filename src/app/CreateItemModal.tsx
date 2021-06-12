import React, { useEffect, useState } from "react";
import { useClientRequest } from "../hooks";
import TextInput from "./TextInput";

interface CreateItemModalProps {
  onClose: () => void
  open: boolean
}

export default function CreateItemModal(props: CreateItemModalProps) {
  const {onClose, open} = props;

  const {setOverlayIsOn, clientRequest} = useClientRequest();

  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("")
  const [error, setError] = useState<string>("");

  function localOnClose() {
    setOverlayIsOn(false);
    onClose();
  }

  async function onCreate() {
    const {res, error} = await clientRequest(client => client.createItem({name: itemName, description: itemDescription}))
    if (error) {
      setError(error.message);
      return;
    }

    setError("");
    localOnClose();
  }

  useEffect(() => {
    if (open) {
      setOverlayIsOn(true);
    } else {
      setOverlayIsOn(false);
    }
  }, [open])
  
  return (
    <>
      <div className={`modal${open ? " open" : ""}`}>
        <div className="modal-header">
            <div className="modal-header-title">Create new item</div>
            <div className="x-close" role="button" tabIndex={0} onClick={localOnClose}>✕</div>
        </div>
        <div className="modal-content">
          <div className="error">{error}</div>
          <TextInput label="Name"
                    type="text"
                    value={itemName}
                    setValue={setItemName} />
          <TextInput label="Description"
                    type="text"
                    value={itemDescription}
                    setValue={setItemDescription} />
          <button onClick={onCreate} style={{width: "fit-content"}}>
            Submit
          </button>
        </div>
      </div>
    </>
  )

}