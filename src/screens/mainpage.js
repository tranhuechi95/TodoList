import React, { useState, useEffect } from 'react';
import TodoList from '../components/todolist';
import Logout from '../components/logout';

const Mainpage = ({ match }) => {
    let { params: {username}} = match;
    let [idForAddItem, setIdForAddItem] = useState(1);
    let [todoList, setTodoList] = useState([]);
    let [todoItem, setTodoItem] = useState('');
    let [idForDel, setIdForDel] = useState(-1);
    let [toUpdateContent, setToUpdateContent] = useState('');
    let [idForUpdate, setIdForUpdate] = useState(-1);

    let [checkAddItem, setCheckAddItem] = useState('');
    let [checkUpdate, setCheckUpdate] = useState('');
    let [checkUpdateContent, setCheckUpdateContent] = useState('');
    let [checkDelete, setCheckDelete] = useState('');
    let [checkDeleteWhole, setCheckDeleteWhole] = useState('');

    let normalFormClass = 'form-control';
    let errorFormClass = 'form-control error';
    let validFormClass = 'form-control success';

    // get the initial state
    useEffect(() => {
        fetch('/initial', {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                currentUser: username,
            })
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
            if (newList[0] !== undefined && newList[0].todoId) {
                setIdForDel(newList[0].todoId);
                setIdForUpdate(newList[0].todoId);
            }
            setTodoList(newList);
        })
        .catch(err => console.log(err))
    }, []);

    const sendRequest = (sendMethod, sendBody) => {
        fetch('/todolist', {
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
            setCheckAddItem(false);
            setCheckUpdate('');
            setCheckUpdateContent('');
            setCheckDelete('');
            setCheckDeleteWhole('');
            // alert("You forget to input sth!");
        } else {
            setIdForAddItem(idForAddItem + 1); // increase the id
            let requestBody = { _id: idForAddItem, toAdd: todoItem, currentUser: username };
            sendRequest('POST', requestBody);
            setTodoList(currentTodo => [...currentTodo, {todoId: idForAddItem, todoContent: todoItem}]);
            setIdForDel(idForAddItem);
            setIdForUpdate(idForAddItem);
            setTodoItem('');
            setCheckDelete('');
        }
    };

    const updateHandler = (updateEvent) => {
        updateEvent.preventDefault();
        if (toUpdateContent === '') {
            setCheckUpdateContent(false);
            setCheckAddItem('');
            setCheckUpdate('');
            setCheckDelete('');
            setCheckDeleteWhole('');
            // alert("You forget update content!");
        } else {
            if (idForUpdate === -1) {
                setCheckUpdate(false);
                setCheckUpdateContent('');
                setCheckAddItem('');
                setCheckDelete('');
                setCheckDeleteWhole('');
                // alert("You forget to choose an item to update!");
            } else {
                // do the update here!
                let itemToUpdate = todoList.find(singleTodo => singleTodo.todoId === parseInt(idForUpdate));
                if (window.confirm(`You want to update "${itemToUpdate.todoContent}" with "${toUpdateContent}" ?`)) {
                    const newTodoList = todoList.map(singletodo => singletodo.todoId === parseInt(idForUpdate)
                    ? {...singletodo, todoContent: toUpdateContent}
                    : singletodo);
                    // send a put request here
                    let requestBody = { currentUser: username, itemToUpdateId: idForUpdate, itemToUpdateContent: toUpdateContent };
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
            setCheckDelete(false);
            setCheckUpdateContent('');
            setCheckAddItem('');
            setCheckUpdate('');
            setCheckDeleteWhole('');

        } else {
            if (content !== undefined && window.confirm(`Do you want to delete "${content}"`)) {
                setTodoList(todoList.filter(singleTodo => {
                    return singleTodo.todoId !== parseInt(idForDel);
                }));
                let requestBody = { currentUser: username, itemToDelete: idForDel };
                sendRequest('DELETE', requestBody);
                if (todoList.length > 1) {
                    for (let item of todoList) {
                        if (item.todoId !== parseInt(idForDel)) {
                            setIdForDel(item.todoId);
                            break;
                        }
                    }
                } else {
                    setIdForDel(-1);
                }
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
                let requestBody = { currentUser: username, itemToDelete: "Whole list"};
                sendRequest('DELETE', requestBody);
            }
        } else {
            setCheckDeleteWhole(false);
            setCheckDelete('');
            setCheckUpdateContent('');
            setCheckAddItem('');
            setCheckUpdate('');
            // alert("The list is already empty");
        }
    };

    return (
        <section className="mainpage-container">
            <TodoList list={todoList}/>
            <div className="main-container-right">
                <header className="header">
                    <div>ACTIONS</div>
                </header>
                <form className="form" onSubmit={addHandler}>
                    <div className={checkAddItem === '' ? normalFormClass : (checkAddItem === false ? errorFormClass : validFormClass)}>
                        <label>To add item</label>
                        <input type="text" placeholder="Add your todo" value={todoItem} 
                            onChange={event => setTodoItem(event.target.value)} maxLength="100"/>
                        <small>Add content cannot be empty</small>
                    </div>
                    <div className="button-container">
                        <input className="button" type="submit" value="ADD" />
                    </div>
                </form>

                <form className="form" onSubmit={updateHandler}>
                    <div className={checkUpdate === '' ? normalFormClass : (checkUpdate === false ? errorFormClass : validFormClass)}>
                        <label>To update item</label>
                        <div className="option-container">
                            <select value={idForUpdate} onChange={event => setIdForUpdate(event.target.value)}>
                                <option className="single-option" value='0' disabled>Select an item</option>
                                {todoList.map(singleTodo => {
                                    return (
                                        <option value={singleTodo.todoId}>{singleTodo.todoContent}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <small>You forget to choose an item</small>
                    </div>
                    <div className={checkUpdateContent === '' ? normalFormClass : (checkUpdateContent === false ? errorFormClass : validFormClass)}>
                        <label>Update item content</label>
                        <input type="text" placeholder="Change item to" value={toUpdateContent} 
                            onChange={event => setToUpdateContent(event.target.value)}/>
                        {/* <input type="submit" value="UPDATE" /> */}
                        <small>Update content cannot be empty</small>
                    </div>
                    <div className="button-container">
                        <input className="button" type="submit" value="UPDATE" />
                    </div>
                </form>

                <form className="form" onSubmit={delHandler}>
                    <div className={checkDelete === '' ? normalFormClass : (checkDelete === false ? errorFormClass : validFormClass)}>
                        <label>To delete item</label>
                        <div className="option-container">
                            <select value={idForDel} onChange={event => setIdForDel(event.target.value)}>
                                <option className="single-option" value='0' disabled>Select an item</option>
                                {todoList.map(singleTodo => {
                                    return (
                                        <option value={singleTodo.todoId}>{singleTodo.todoContent}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <small>Nothing to delete</small>
                    </div>
                    <div className="button-container">
                        <input className="button" type="submit" value="DELETE ITEM" />
                    </div>
                </form>

                <form className="form" onSubmit={delWholeHandler}>
                    <div className={checkDeleteWhole === '' ? normalFormClass : (checkDeleteWhole === false ? errorFormClass : validFormClass)}>
                        <small>The list is already empty</small>
                    </div>
                    <div className="button-container">
                        <input className="button" type="submit" value="DELETE WHOLE LIST" />
                    </div>
                </form>
            </div>
            <Logout  user={username}/>    
        </section>
        
    )
};

export default Mainpage;