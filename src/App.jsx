import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
// import { uuid } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

    //add new todo item to database
    const addItem = async (e) => {
      e.preventDefault();
      try{
        const res = await axios.put('https://pecwn0f2d1.execute-api.us-east-2.amazonaws.com/dev/items', {id: uuidv4(), item: itemText})
        console.log("Before: " + JSON.stringify(listItems))
        setListItems(prev => [...prev, res.data]);
        console.log("after: " + JSON.stringify(listItems))
        setItemText('');
      }catch(err){
        console.log(err);
      }
    }
  
    //Create function to fetch all todo items from database -- we will use useEffect hook
    useEffect(()=>{
      const getItemsList = async () => {
        try{
          const res = await axios.get('https://pecwn0f2d1.execute-api.us-east-2.amazonaws.com/dev/items')
          setListItems(res.data.Items);
        }catch(err){
          console.log(err);
        }
      }
      getItemsList()
    },[]);
  
    // Delete item when click on delete
    const deleteItem = async (id) => {
      try{
        const res = await axios.delete(`https://pecwn0f2d1.execute-api.us-east-2.amazonaws.com/dev/items/${id}`)
        const newListItems = listItems.filter(item => item.id !== id);
        setListItems(newListItems);
      }catch(err){
        console.log(err);
      }
    }

    //Update item
    const updateItem = async (e) => {
      e.preventDefault()
      try{
        const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText})
        console.log(res.data)
        const updatedItemIndex = listItems.findIndex(item => item.id === isUpdating);
        const updatedItem = listItems[updatedItemIndex].item = updateItemText;
        setUpdateItemText('');
        setIsUpdating('');
      }catch(err){
        console.log(err);
      }
    }
    //before updating item we need to show input field where we will create our updated item
    const renderUpdateForm = () => (
      <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >
        <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />
        <button className="update-new-btn" type="submit">Update</button>
      </form>
    )

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => {setItemText(e.target.value)} } value={itemText} />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
      {/* <p>in place of n.map is not a function</p> */}
        {
          listItems.map(item => (
          <div className="todo-item">
            {
              isUpdating === item.id
              ? renderUpdateForm()
              : <>
                  <p className="item-content">{item.item}</p>
                  <button className="update-item" onClick={()=>{setIsUpdating(item.id)}}>Update</button>
                  <button className="delete-item" onClick={()=>{deleteItem(item.id)}}>Delete</button>
                </>
            }
          </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
