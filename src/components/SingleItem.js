import React, { useState } from 'react';

const SingleItem = ({info}) => {
    const [strikeThrough, setStrikeThrough] = useState(false);
    function itemStrikeThroughFunc() {
        setStrikeThrough(!strikeThrough);
        // toggle the true and false
    }
    return (
        <div className={strikeThrough ? 'single-item-container done' : 'single-item-container'} 
            onClick={itemStrikeThroughFunc}>{info.todoContent}</div>
    )
}

export default SingleItem;