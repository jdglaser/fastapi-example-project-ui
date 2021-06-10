import React, { useEffect, useState } from "react";
import { useClientRequest } from "./hooks";
import TextInput from "./TextInput";
import { Item } from "./types";
import {BeatLoader} from "react-spinners"

export default function ItemPage() {
  const {clientRequest} = useClientRequest();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [loading, setLoadin] = useState<boolean>(true);

  async function loadItems() {
    const {res, error} = await clientRequest(client => client.getItems());
    if (res) {
      setItems(res);
      setError("")
      return;
    }

    if (error && error.errorCode !== 401) {
      setError(error.message);
    }
  }

  async function onCreate() {
    const {res, error} = await clientRequest(client => client.createItem({name: itemName, description: itemDescription}))
    if (error) {
      setError(error.message);
      return;
    }

    setError("")
    await loadItems()
  }

  async function onDelete(itemId: number) {
    const {res, error} = await clientRequest(client => client.deleteItem(itemId))
    if (error) {
      setError(error.message)
      return;
    }

    setError("");
    await loadItems()
  }

  useEffect(() => {
    setLoadin(true)
    loadItems().then(res => {
      setLoadin(false);
    });
  }, [])

  const itemList = items.map(item => {
    return (
      <li key={item.name}>
        <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
        <span><b>{item.name}</b>: {item.description}</span>
        <span role="button" 
              className="trash-icon"
              tabIndex={0} 
              style={{cursor: "pointer"}}
              onClick={() => onDelete(item.id)}>🗑️</span>
        </div>
      </li>
    )
  })

  if (loading) {
    return (
      <div style={{display: "flex", justifyContent: "center", height: "100%", alignItems: "center"}}>
        <BeatLoader color="lightseagreen" loading={loading} size={15} margin={3} />
      </div>
    )
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
      <h2>Items</h2>
      <div className="error">
        {error}
      </div>
      <h3>Create new item</h3>
      <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "fit-content", marginBottom: "10px"}}>
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
        <h3>Item List</h3>
        <ol style={{height: "200px", 
          width: "fit-content",
          overflowY: "scroll", 
          border: "1px solid lightseagreen",
          borderRadius: "10px",
          padding: "5px 25px"}}>
          {itemList}
        </ol>
    </div>
  )
}