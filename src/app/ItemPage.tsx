import React, { useEffect, useState } from "react";
import { useClientRequest } from "../hooks";
import TextInput from "./TextInput";
import { Item, ItemUpdate } from "../types";
import {BeatLoader} from "react-spinners"
import CreateItemModal from "./CreateItemModal";

export default function ItemPage() {
  const {clientRequest, overlayIsOn} = useClientRequest();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoadin] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function onClose() {
    setModalOpen(false);
    loadItems();
  }

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

  async function onDelete(itemId: number) {
    const {res, error} = await clientRequest(client => client.deleteItem(itemId))
    if (error) {
      setError(error.message)
      return;
    }

    setError("");
    await loadItems()
  }

  async function onComplete(item_name: string, item: ItemUpdate) {
    const {res, error} = await clientRequest(client => client.updateItem(item_name, item))
    if (error) {
      setError(error.message)
      return;
    }

    setError("");
    await loadItems();
  }

  useEffect(() => {
    setLoadin(true)
    loadItems().then(res => {
      setLoadin(false);
    });
  }, [])

  const itemList = items.map(item => {
    return (
      <div key={item.name}>
        <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
          <input type="checkbox"
                 checked={item.completed}
                 onChange={() => onComplete(item.name, {description: item.description, completed: !item.completed})}></input>
          <div className="item-content">
            <span className={`${item.completed ? " completed" : ""}`}><b>{item.name}</b>: {item.description}</span>
            <span role="button" 
                  className="trash-icon"
                  tabIndex={0} 
                  style={{cursor: "pointer"}}
                  onClick={() => onDelete(item.id)}>🗑️</span>
          </div>
        </div>
      </div>
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
      <CreateItemModal onClose={onClose} open={modalOpen} />
      <div className="error">
        {error}
      </div>
      <button style={overlayIsOn ? {"transition": "none", "opacity": "100%"} : {}} onClick={() => setModalOpen(true)}>Create</button>
      <div className="item-list-container" 
           style={{height: "200px", 
                    width: "100%",
                    overflowY: "scroll", 
                    border: "1px solid lightseagreen",
                    borderRadius: "10px",
                    padding: "5px 25px",
                    marginTop: "10px"}}>
        {itemList.length !== 0 ? 
          (
            <>
              {itemList}
            </>
          ) : 
          (
            <div>No items to show...</div>
          )
        }
      </div>
    </div>
  )
}