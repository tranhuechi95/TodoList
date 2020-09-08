import React from 'react';

const TodoList = ({list}) => {
    return (
        <div className="main-container-left">
            <header className="header">
                <div>YOUR TO DO LIST</div>
            </header>
            <div className="items-container">
                { list.length !== 0 && list[0].todoContent !== undefined
                    ? list.map(singleTodo => {
                    return (
                        <div className="single-item-container">{singleTodo.todoContent}</div>
                    )})
                    : <div>Nothing yet!</div>
                }
            </div>
            
        </div>
    )  
}

export default TodoList;