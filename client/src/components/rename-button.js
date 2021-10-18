/**
    * Showing ticket title to screen
    * Adding rename button for each title that will render the new title on ticket
 */

import React, { useState } from 'react';
import '.././App.scss';

function Rename(props) {
    let currTitle = props.title
    const [title, setTitle] = useState(currTitle)

    function ChangeTitle () {
        let newTitle = prompt("Enter new title")
        setTitle(newTitle)

    }

    return (
        <div>
            {props.title === title?
                <div>
                    <h5 className='title'>{props.title}
                        <button type='button' className='rename-btn' onClick={() => {ChangeTitle()}} >Rename title</button>
                    </h5>

                </div> :
                <div>
                    <h5 className='title'>{title}
                        <button type='button' className='rename-btn' onClick={() => {ChangeTitle()}} >Rename title</button>
                    </h5>
                </div>

            }
        </div>
    )
}

export default Rename;