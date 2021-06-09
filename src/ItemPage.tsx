import React, { useEffect, useState } from "react";
import { useClientRequest } from "./hooks";
import TextInput from "./TextInput";
import { Item } from "./types";

export default function ItemPage() {
  const {clientRequest} = useClientRequest();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");

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
    loadItems();
  }, [])

  const itemList = items.map(item => {
    return (
      <li key={item.name}>
        {item.name}: {item.description} 
        <span role="button" 
              tabIndex={0} 
              style={{cursor: "pointer"}}
              onClick={() => onDelete(item.id)}>❌</span>
      </li>
    )
  })

  return (
    <>
      <h1>Items</h1>
      <div className="error">
        {error}
      </div>
      <h2>Create new item</h2>
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
      <h2>Item List</h2>
      <ul>
        {itemList}
      </ul>
    </>
  )
}