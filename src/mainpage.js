import React, { useState, useEffect } from 'react';

const Mainpage = () => {
    let [idForAddItem, setIdForAddItem] = useState(1);
    let [todoList, setTodoList] = useState([]);
    let [todoItem, setTodoItem] = useState('');
    let [idForDel, setIdForDel] = useState(-1);
    let [toUpdateContent, setToUpdateContent] = useState('');
    let [idForUpdate, setIdForUpdate] = useState(-1);

    // get the initial state
    useEffect(() => {
        fetch('/initial', {
            method: 'GET',
        }).then(res => res.json())
        .then(jsonRes => {
            console.log(jsonRes);
            let newList = [];
            let maxId = 0;
            for (let item of jsonRes) {
                newList.push({todoId: item._id, todoContent: item.toAdd});
                maxId = Math.max(maxId, parseInt(item._id));
            }
            setIdForAddItem(maxId + 1);
            console.log(newList[0].todoId);
            setIdForDel(newList[0].todoId);
            setIdForUpdate(newList[0].todoId);
            setTodoList(newList);
        })
        .catch(err => console.log(err))
    }, []);

    const sendRequest = (sendMethod, sendBody) => {
        fetch('/', {
            method: sendMethod,
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(
                sendBody
            )
        }).then(res => res.text())
        .then(textRes => console.log(textRes))
        .catch(err => console.log(err));
    }

    const addHandler = (addEvent) => {
        // send a post request to the server from here!
        addEvent.preventDefault();
        if (todoItem === '') {
            alert("You forget to input sth!");
        } else {
            // let currentId = Math.floor(Math.random() * 100000);
            setIdForAddItem(idForAddItem + 1); // increase the id
            let requestBody = { _id: idForAddItem, toAdd: todoItem };
            sendRequest('POST', requestBody);
            setTodoList(currentTodo => [...currentTodo, {todoId: idForAddItem, todoContent: todoItem}]);
            setIdForDel(idForAddItem);
            setIdForUpdate(idForAddItem);
            setTodoItem('');
        }
    };

    const updateHandler = (updateEvent) => {
        updateEvent.preventDefault();
        if (toUpdateContent === '') {
            alert("You forget update content!");
        } else {
            if (idForUpdate === -1) {
                alert("You forget to choose an item to update!");
            } else {
                // do the update here!
                let itemToUpdate = todoList.find(singleTodo => singleTodo.todoId === parseInt(idForUpdate));
                if (window.confirm(`You want to update "${itemToUpdate.todoContent}" with "${toUpdateContent}" ?`)) {
                    const newTodoList = todoList.map(singletodo => singletodo.todoId === parseInt(idForUpdate)
                    ? {...singletodo, todoContent: toUpdateContent}
                    : singletodo);
                    // send a put request here
                    let requestBody = { itemToUpdateId: idForUpdate, itemToUpdateContent: toUpdateContent };
                    sendRequest('PUT', requestBody);
                    setTodoList(newTodoList);
                    setIdForUpdate(-1);
                    setToUpdateContent('');
                }
            }
        }
    }

    const delHandler = (deleteEvent) => {
        // send a delete request to the server
        deleteEvent.preventDefault(); // Do not forget this!
        let content = '';
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].todoId === parseInt(idForDel)) {
                content = todoList[i].todoContent;
                break;
            }
        }
        if (content === '') {
            alert("Your list is empty");
        } else {
            if (content !== undefined && window.confirm(`Do you want to delete "${content}"`)) {
                setTodoList(todoList.filter(singleTodo => {
                    return singleTodo.todoId !== parseInt(idForDel);
                }));
                let requestBody = { itemToDelete: idForDel };
                sendRequest('DELETE', requestBody);
                setIdForDel(-1);
            }
        } 
    };

    const delWholeHandler = (deleteWholeEvent) => {
        deleteWholeEvent.preventDefault();
        // send a delete request to the server
        if (todoList.length > 0) {
            if (window.confirm("Do you want to delete the whole list?")) {
                setTodoList([]);
                // send a delete request
                setIdForDel(-1);
                let requestBody = { itemToDelete: "Whole list"};
                sendRequest('DELETE', requestBody);
            }
        } else {
            alert("The list is already empty");
        }
    };

    return (
        <div className="mainpage-container" id="mainpage-container-id">
            <div>YOUR TO DO LIST</div>
            { todoList.length !== 0 && todoList[0].todoContent !== undefined
                ? todoList.map(singleTodo => {
                return (
                    <div>{singleTodo.todoContent}</div>
                )})
                : <div>Nothing yet!</div>
            }
            <form className="add-item-container" onSubmit={addHandler}>
                <label>To add item
                    <input type="text" placeholder="Add your todo" value={todoItem} 
                        onChange={event => setTodoItem(event.target.value)} />
                    <input type="submit" value="ADD"/>
                </label>
            </form>

            <form onSubmit={updateHandler}>
                <label>To update item
                    <select value={idForUpdate} onChange={event => setIdForUpdate(event.target.value)}>
                        <option value='0' disabled>Select an item</option>
                        {todoList.map(singleTodo => {
                            return (
                                <option value={singleTodo.todoId}>{singleTodo.todoContent}</option>
                            )
                        })}
                    </select>
                    <input type="text" placeholder="Change item to" value={toUpdateContent} 
                        onChange={event => setToUpdateContent(event.target.value)}/>
                    <input type="submit" value="UPDATE" />
                </label>
            </form>

            <form className="delete-item-container" onSubmit={delHandler}>
                <label>To delete items
                    <select value={idForDel} onChange={event => setIdForDel(event.target.value)}>
                        <option value='0' disabled>Select an item</option>
                        {todoList.map(singleTodo => {
                            return (
                                <option value={singleTodo.todoId}>{singleTodo.todoContent}</option>
                            )
                        })}
                    </select>
                    <input type="submit" value="DELETE ITEM"/>
                </label>
            </form>

            <form className="delete-entire-list" onSubmit={delWholeHandler}>
                <label>To delete entire list
                    <input type="submit" value="DELETE WHOLE LIST" />
                </label> 
            </form>
        </div>
    )
};

export default Mainpage;