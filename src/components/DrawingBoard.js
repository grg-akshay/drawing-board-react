import React from 'react';

import '../styles/DrawingBoard.scss';
import Toolbox from './Toolbox';
import { BRUSH_TYPE, BRUSH_WIDTH, PALLETE_TYPE, BRUSH_COLOR } from '../constants/brush';

const CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 400;

/**
 * Component for rendering the drawing board app
 * It makes use of Canvas API. For more info read: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * 
 * @todo: canvas-wrapper to be moved in separate component
 */
export class DrawingBoard extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.canvasCursorRef = React.createRef();
        this.canvasWrapperRef = React.createRef();

        this.state = {
            // could be PENCIL, HIGHLIGHTER, or ERASER
            // by default it is PENCIL
            brushType: BRUSH_TYPE.PENCIL,

            // if this is true, it means either you are drawing with the help of pencil/highlighter
            // or you are erasing with the help of eraser
            usingBrush: false,
            brushColor: BRUSH_COLOR.BLACK,
            brushWidth: BRUSH_WIDTH.MEDIUM,

            backgroundColor: BRUSH_COLOR.WHITE,
            context: null,
            savedHighlighterContext: null,

            // could be SIZE, COLOR, or null
            palleteType: null
        };

        this.startDrawing = this.startDrawing.bind(this);
        this.finishDrawing = this.finishDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.handleChangeBrush = this.handleChangeBrush.bind(this);
        this.setBrushStyle = this.setBrushStyle.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleWidthClick = this.handleWidthClick.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.setCanvasCursorStyle = this.setCanvasCursorStyle.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorClick = this.handleColorClick.bind(this);
    }

    componentDidMount () {
        // context is the thing on which drawing will be rendered.
        const context = this.canvasRef.current.getContext('2d');

        this.setState({ context });
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.fillStyle = this.state.backgroundColor;
        context.translate(0.5, 0.5);

        // setting this for correct positioning of custom canvas cursor
        this.canvasWrapperRef.current.style.width = `${CANVAS_WIDTH}px`;
        this.canvasWrapperRef.current.style.height = `${CANVAS_HEIGHT}px`;   
    }

    setBrushStyle (context, brushType) {
        switch (brushType) {
            case BRUSH_TYPE.PENCIL:
                context.lineWidth = this.state.brushWidth;
                context.strokeStyle = this.state.brushColor;
                context.globalAlpha = 1;
                break;

            case BRUSH_TYPE.ERASER:
                context.lineWidth = this.state.brushWidth;
                context.strokeStyle = this.state.backgroundColor; // eraser given background color
                context.globalAlpha = 1;
                break;

            case BRUSH_TYPE.HIGHLIGHTER:
                // highlighter have a fixed width 5px and dynamic brush color with opacity 50%
                context.lineWidth = BRUSH_WIDTH.LARGE; 
                context.strokeStyle = this.state.brushColor;
                context.globalAlpha = 0.5; // opacity at 0.5
                break;
            
            default:
                break;
        }
    }

    handleWidthClick () {
        if (this.state.palleteType === PALLETE_TYPE.SIZE) {
            this.setState({ palleteType: null });
        }
        else {
            this.setState({ palleteType: PALLETE_TYPE.SIZE });
        }
    }

    handleWidthChange (width) {
        this.setState({ 
            brushWidth: width,
            palleteType: null
        });
    }

    handleColorClick () {
        if (this.state.palleteType === PALLETE_TYPE.COLOR) {
            this.setState({ palleteType: null });
        }
        else {
            this.setState({ palleteType: PALLETE_TYPE.COLOR });
        }
    }

    handleColorChange (color) {
        this.setState({ 
            brushColor: color,
            palleteType: null
        });
    }

    handleClear () {
        this.state.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // remove any saved image due to previous highlighter stroke
        this.state.savedHighlighterContext && this.setState({ savedHighlighterContext: null });
    }

    handleChangeBrush (type) {
        this.setState({ brushType: type });
    }

    startDrawing (e) {
        const {offsetX, offsetY} = e.nativeEvent,
            { context, brushType, savedHighlighterContext } = this.state;

        // before drawing set brush style
        this.setState({ usingBrush: true });
        this.canvasCursorRef.current.style.display = 'block';

        // check if there's some saved highlighter data, 
        // then before drawing remove the previous highlighter stroke
        if (savedHighlighterContext) {
            context.putImageData(savedHighlighterContext, 0, 0);
            this.setState({ savedHighlighterContext: null });
        }

        // check brush type
        switch (brushType) {
            case BRUSH_TYPE.PENCIL:
            case BRUSH_TYPE.ERASER:
                this.setBrushStyle(context, brushType);
                context.beginPath();
                context.moveTo(offsetX, offsetY);
                break;

            case BRUSH_TYPE.HIGHLIGHTER:
                // save the current image so as to remove the highlighter stroke in future
                this.setState({ savedHighlighterContext: context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) });

                this.setBrushStyle(context, brushType);
                context.beginPath();
                context.moveTo(offsetX, offsetY);
                break;

            default:
                break;
        }
    }

    setCanvasCursorStyle (x, y) {
        // cursor for eraser has color as background color and the 
        // cursor is slightly enlarged to make it more visible
        if (this.state.brushType === BRUSH_TYPE.ERASER) {
            this.canvasCursorRef.current.style.background = this.state.backgroundColor;
            this.canvasCursorRef.current.style.width = `${this.state.brushWidth + 8}px`; // 8 is offset here
            this.canvasCursorRef.current.style.height = `${this.state.brushWidth + 8}px`; // 8 is offset here
        }
        else {
            this.canvasCursorRef.current.style.background = this.state.brushColor;
            this.canvasCursorRef.current.style.width = `${this.state.brushWidth + 4}px`; // 4 is offset here
            this.canvasCursorRef.current.style.height = `${this.state.brushWidth + 4}px`; // 4 is offset here
        }

        this.canvasWrapperRef.current.style.cursor = 'none';
        this.canvasCursorRef.current.style.left = `${x}px`;
        this.canvasCursorRef.current.style.top = `${y}px`;
        this.canvasCursorRef.current.style.display = 'block';
    }
     
    draw (e) {
        const {offsetX, offsetY} = e.nativeEvent,
            { context, brushType } = this.state;

        // first set custom cursor positon based on mouse postion
        this.setCanvasCursorStyle(offsetX, offsetY);

        // early bailout if the canvas is not in the drawing state
        if (!this.state.usingBrush) {
            return;
        }

        // check brush type
        switch (brushType) {
            case BRUSH_TYPE.HIGHLIGHTER:
                // go back to previous image
                // this is done to avoid the "layering" effect while using `lineTo`
                context.putImageData(this.state.savedHighlighterContext, 0, 0);

            case BRUSH_TYPE.PENCIL:
            case BRUSH_TYPE.ERASER:
                context.lineTo(offsetX, offsetY);
                context.stroke();
                break;

            default:
                break;
        }    
    }

    finishDrawing () {
        this.state.context.closePath();
        this.setState({ usingBrush: false });
    }

    render () {
        return (
            <React.Fragment>
                <div className='canvas-wrapper' ref={this.canvasWrapperRef}>
                    <div 
                        className='canvas-cursor' 
                        ref={this.canvasCursorRef}
                    />
                    <canvas 
                        id='canvas' 
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onMouseDown={this.startDrawing}
                        onMouseUp={this.finishDrawing}
                        onMouseMove={this.draw}
                        onMouseEnter={() => { this.canvasCursorRef.current.style.display = 'block'; }}
                        onMouseOut={() => { this.canvasCursorRef.current.style.display = 'none'; }}
                        ref={this.canvasRef}
                    />
                </div>
                <Toolbox 
                    palleteType={this.state.palleteType}
                    brushType={this.state.brushType}
                    brushWidth={this.state.brushWidth}
                    brushColor={this.state.brushColor}
                    onChangeBrush={this.handleChangeBrush}
                    onClear={this.handleClear}
                    onWidthClick={this.handleWidthClick}
                    onWidthChange={this.handleWidthChange}
                    onColorChange={this.handleColorChange}
                    onColorClick={this.handleColorClick}
                />
            </React.Fragment>
        );
    }  
}