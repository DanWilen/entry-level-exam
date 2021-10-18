/**
    * Showing the content of each tickets to screen
    * Restrict the content to 3 lines max on default
    * Contains See more / see less button which enable viewing all content if needed
 */

import React, { useState } from 'react';
import '.././App.scss';

function ShowContent(props) {
    const [isTruncated, setContent] = useState(true)

    function ShowButton() {
        setContent(!isTruncated)
    }

    return (
        <div>
            {isTruncated?
                <p className='data-content'> {props.content.slice(0,380)}</p>:
                <p className='data-content'>{props.content}</p>}
            {props.content.length > 380 &&
            <a className='show-btn' onClick={() => {ShowButton()}}>
                {isTruncated? 'See More':'See less'}</a>}
        </div>
    )
}

export default ShowContent;

