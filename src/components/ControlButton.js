import React from 'react';
import classnames from 'classnames';

import '../styles/ControlButton.scss';
import { BRUSH_TYPE } from '../constants/brush';
import { capitalizeFirstChar } from '../utils/string';

/**
 * ControlButton
 * @param {String} type
 * @param {Function} onClick
 * @param {String} className
 */
export default function ControlButton ({ type, onClick, className }) {
    const displayName = capitalizeFirstChar(type);

    function getFontAwesomeClassName () {
        // fontawesome class names
        return classnames('fas', {
            'fa-pencil-alt':    type === BRUSH_TYPE.PENCIL,
            'fa-highlighter':   type === BRUSH_TYPE.HIGHLIGHTER,
            'fa-eraser':        type === BRUSH_TYPE.ERASER,
            'fa-undo':          type === 'undo',
            'fa-times':         type === 'clear'
        });
    }

    // for size button don't use font awesome icons
    if (type === 'size') {
        return (
            <button 
                className='control-button non-icon__button'
                title={displayName}
                onClick={onClick}
            >
                <div className={`width-button__inner ${className}`}></div>
            </button>
        );
    }

    // for color button don't use font awesome icons
    if (type === 'color') {
        return (
            <button 
                className={`control-button non-icon__button  ${className}`}
                title={displayName}
                onClick={onClick}
            />
        )
    }

    return (
        <button 
            className={`control-button ${className}`}
            title={displayName}
            onClick={onClick}
        >
            <div className='control-button__icon'>
                <i className={getFontAwesomeClassName()}></i>
            </div>
        </button>
    )
}