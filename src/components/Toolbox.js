import React from 'react';
import classnames from 'classnames';

import '../styles/Toolbox.scss';
import { BRUSH_TYPE, BRUSH_WIDTH, PALLETE_TYPE, BRUSH_COLOR } from '../constants/brush';
import ControlButton from './ControlButton';

function getWidthOuterClassname (width, currentWidth) {
    return classnames('width-button__outer', {
        'is-active': (width === currentWidth)
    });
}

function getWidthInnerClassname (width) {
    return classnames('width-button__inner', {
        'size-1px': (width === BRUSH_WIDTH.SMALL),
        'size-3px': (width === BRUSH_WIDTH.MEDIUM),
        'size-5px': (width === BRUSH_WIDTH.LARGE)
    });
}

// Pallete should be made like a dropdown component, it should be able to decide
// it's position using getBoundingClientRect() 

/**
 * Pallete for showing different available brush sizes
 * @param {Number} currentWidth of brush
 * @param {Function} onWidthChange - handler called whenever a size is selected
 */
function BrushWidthPallete ({ currentWidth, onWidthChange }) {
    return (
        <div className='width-panel'>
            {
                Object.values(BRUSH_WIDTH).map((width) => {
                    return (
                        <button 
                            key={width} 
                            className='width-button' 
                            onClick={() => onWidthChange(width)}
                        >
                            <div className={getWidthOuterClassname(width, currentWidth)}>
                                <div className={getWidthInnerClassname(width)}></div>
                            </div>
                        </button>
                    );
                })
            }
        </div>
    );
}

/**
 * Pallete for showing different colors
 */
function BrushColorPallete ({ currentColor, onColorChange }) {
    function getColorClassname (color, currentColor) {
        return classnames('width-button__outer', {
            'is-active': (color === currentColor),
            'is-black-active': ((currentColor === color) && (currentColor === BRUSH_COLOR.BLACK)),
            'color-black': (color === BRUSH_COLOR.BLACK),
            'color-orange': (color === BRUSH_COLOR.ORANGE),
            'color-red': (color === BRUSH_COLOR.RED),
            'color-yellow': (color === BRUSH_COLOR.YELLOW),
            'color-white': (color === BRUSH_COLOR.WHITE),
            'color-blue': (color === BRUSH_COLOR.BLUE),
            'color-green': (color === BRUSH_COLOR.GREEN),
            'color-purple': (color === BRUSH_COLOR.PURPLE),
        });
    }

    return (
        <div className='width-panel panel-size-wide'>
            {
                Object.values(BRUSH_COLOR).map((color) => {
                    return (
                        <button 
                            key={color} 
                            className='width-button' 
                            onClick={() => onColorChange(color)}
                        >
                            <div className={getColorClassname(color, currentColor)} />
                        </button>
                    );
                })
            }
        </div>
    );
}

/**
 * Toolbox contains all the controls for drawing on the canvas
 * 
 * @todo: add support for undo option
 */
export default function Toolbox (props) {
    function getActiveColorClassName (color) {
        return classnames({
            'color-black': (color === BRUSH_COLOR.BLACK),
            'color-orange': (color === BRUSH_COLOR.ORANGE),
            'color-red': (color === BRUSH_COLOR.RED),
            'color-yellow': (color === BRUSH_COLOR.YELLOW),
            'color-white': (color === BRUSH_COLOR.WHITE),
            'color-blue': (color === BRUSH_COLOR.BLUE),
            'color-green': (color === BRUSH_COLOR.GREEN),
            'color-purple': (color === BRUSH_COLOR.PURPLE)
        });
    }

    return (
        <div className='toolbox'>
            {(props.palleteType === PALLETE_TYPE.SIZE) && 
                <BrushWidthPallete 
                    currentWidth={props.brushWidth} 
                    onWidthChange={props.onWidthChange} 
                />
            }
            {(props.palleteType === PALLETE_TYPE.COLOR) && 
                <BrushColorPallete 
                    currentColor={props.brushColor}
                    onColorChange={props.onColorChange}
                />
            }

            {/* BRUSH TYPES */}
            <div className='toolbox__left'>
                {
                    Object.keys(BRUSH_TYPE).map((type) => {
                        return (
                            <ControlButton 
                                key={type}
                                className={classnames({'is-active': props.brushType === type })}
                                type={type} 
                                onClick={() => props.onChangeBrush(type)} 
                            />
                        );
                    })
                }

                {/* MODIFIERS: changes brush's size/color */}
                {/* on eraser only width is applicable */}
                {/* on highlighter only color is applicable */}
                {(props.brushType !== BRUSH_TYPE.HIGHLIGHTER) &&
                    <ControlButton 
                        type='size' 
                        className={getWidthInnerClassname(props.brushWidth)}
                        onClick={props.onWidthClick}
                    />
                }
                {(props.brushType !== BRUSH_TYPE.ERASER) &&
                    <ControlButton 
                        type='color' 
                        className={getActiveColorClassName(props.brushColor)}
                        onClick={props.onColorClick}
                    />
                }
            </div>

            {/* these are destructive actions so keeping them separate */}
            {/* @todo: different background color for them, example: red */}
            <div className='toolbox__right'>
                {/* <ControlButton type='undo' /> */}
                <ControlButton type='clear' onClick={props.onClear}/>
            </div>
        </div>
    )
}