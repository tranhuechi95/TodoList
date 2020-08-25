import React, { useState } from 'react';

const Mainpage = () => {
    let [todoList, setTodoList] = useState([]);
    let [todo, setTodo] = useState();
    let [todel, setTodel] = useState('');

    const addHandler = (e) => {
        // send a post request to the server from here!
        e.preventDefault();
        if (todo === undefined) {
            alert("You forget to input sth!");
        } else {
            setTodoList(currentTodo => [...currentTodo, todo]);
            // alert(`Your current todo is ${todo}`);
            setTodo('');
            fetch('/', {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    toAdd : todo,
                })
            }).then(res => res.json())
            .then(jsonRes => {
                console.log(jsonRes);
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

    const delHandler = (e) => {
        // send a delete request to the server
        e.preventDefault(); // Do not forget this!
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
                <form onSubmit={addHandler}>
                    <input type="text" placeholder="Add your todo" value={todo} onChange={e => setTodo(e.target.value)} />
                    <input type="submit" value="ADD"/>
                </form>
            </div>
            <div className="delete-item-container">To delete items
                <form onSubmit={delHandler}>
                    <input type="number" placeholder="What item do you want to delete ?" 
                        value={todel} onChange={e => setTodel(e.target.value)} />
                    <input type="submit" value="DELETE ITEM"  />
                </form>
            </div>
            <div className="delete-entire-list">To delete entire list
                <button onClick={delWholeHandler}>DELETE WHOLE LIST</button>
            </div>
        </div>
    )
};

export default Mainpage;