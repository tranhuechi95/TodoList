import React, { useState } from 'react';

const Mainpage = () => {
    let [todoList, setTodoList] = useState([]);
    let [todo, setTodo] = useState();
    let [todel, setTodel] = useState('');

    const addHandler = () => {
        // send a post request to the server from here!
        if (todo === undefined) {
            alert("You forget to input sth!");
        } else {
            setTodoList(currentTodo => [...currentTodo, todo]);
            setTodo('');
            alert(`Your current todo is ${todo}`);
        }
    };

    const delHandler = () => {
        // send a delete request to the server
        alert(`You want to delete item number ${todel}`);
    };

    const delWholeHandler = () => {
        // send a delete request to the server
        alert("You want to delete your whole list");
    };

    return (
        <div className="mainpage-container" id="mainpage-container-id">
            <div>YOUR TO DO LIST</div>
            { todoList.length !== 0 && todoList[0] !== undefined
                ? todoList.map(singleTodo => {
                return (
                    <div>{singleTodo}</div>
                )})
                : <div>Nothing yet!</div>
            }
            <div className="add-item-container">To add items
                <form>
                    <input type="text" placeholder="Add your todo" value={todo} onChange={e => setTodo(e.target.value)} />
                    {/* <input type="submit" value="ADD" onSubmit={addHandler} /> */}
                </form>
                <button onClick={addHandler}>ADD</button>
            </div>
            <div className="delete-item-container">To delete items
                <form>
                    <input type="number" placeholder="What item do you want to delete ?" value={todel} onChange={e => setTodel(e.target.value)} />
                </form>
                <button onClick={delHandler}>DELETE ITEM</button>
            </div>
            <div className="delete-entire-list">To delete entire list
                <button onClick={delWholeHandler}>DELETE WHOLE LIST</button>
            </div>
        </div>
    )
};

export default Mainpage;