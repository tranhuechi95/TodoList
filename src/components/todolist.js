import React from 'react';
import SingleItem from './SingleItem';

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
                        <SingleItem info={singleTodo} key={singleTodo.todoId}/>
                    )})
                    : <div className="single-item-container">Nothing yet!</div>
                }
            </div>
        </div>   
    )
}

export default TodoList;