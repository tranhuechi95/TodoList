import React, { useState } from 'react';

const Mainpage = () => {
    let [id, setId] = useState(1);
    let [todoList, setTodoList] = useState([]);
    let [todo, setTodo] = useState();
    let [IdforDel, setIdforDel] = useState(0);

    const addHandler = (e) => {
        // send a post request to the server from here!
        e.preventDefault();
        if (todo === undefined) {
            alert("You forget to input sth!");
        } else {
            setId(id + 1);
            setTodoList(currentTodo => [...currentTodo, {todoId: id, todoContent: todo}]);
            // alert(`Your current todo is ${todo}`);
            setTodo('');
            setIdforDel(id);
            fetch('/', {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    itemId : id,
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
        let content;
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].todoId === parseInt(IdforDel)) {
                content = todoList[i].todoContent;
                break;
            }
        }
        if (window.confirm(`Do you want to delete "${content}"`)) {
            setTodoList(todoList.filter(singleTodo => {
                return singleTodo.todoId != IdforDel;
            }));
            setIdforDel(0);
            fetch('/', {
                method: 'DELETE',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    itemToDelete: IdforDel,
                })
            }).then(res => res.json())
            .then(jsonRes => console.log(jsonRes))
            .catch(err => console.log(err))
        }
    };

    const delWholeHandler = () => {
        // send a delete request to the server
        setTodoList([]);
        // send a delete request
        setIdforDel(0);
        fetch('/', {
            method: 'DELETE',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                itemToDelete: "Whole list",
            })
        }).then(res => res.json())
        .then(jsonRes => {
            console.log(jsonRes.message);
        })
        .catch(err => {
            console.log(err);
        })
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
                <label>To add items
                    <input type="text" placeholder="Add your todo" value={todo} 
                        onChange={e => setTodo(e.target.value)} />
                    <input type="submit" value="ADD"/>
                </label>
            </form>

            <form className="delete-item-container" onSubmit={delHandler}>
                <label>To delete items
                    <select value={IdforDel} onChange={e => setIdforDel(e.target.value)}>
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

            <form className="delete-entire-list" onSubmit={() => {
                        if (window.confirm("Do you want to delete the whole list?")) {
                            delWholeHandler();
                        }
                    }}>
                <label>To delete entire list
                    <input type="submit" value="DELETE WHOLE LIST" />
                </label> 
            </form>
        </div>
    )
};

export default Mainpage;