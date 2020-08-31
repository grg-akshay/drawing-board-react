# drawing-board-react
Simple drawing board application build in React using HTML5 Canvas API.

Live Demo: http://drawing-board-react.surge.sh/

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Functionality
1. Provides different types of drawing brush like Pen, Highlighter, and Eraser.
2. Provides modifiers to change the color and width of brush. Color can be changed of pen and highlighter. Width can be changed of pen and eraser.
3. Provides ability to clear the board.
4. It makes use of a custom cursor over the drawing board for better UX.

- Pen: Makes permanent strokes, may vary width like 1, 3, 5 px.
- Highlighter: Makse a stroke with width 5px and color opacity of 50%, gets
removed from canvas when user draw next stroke.
- Eraser: Make strokes which removes the drawing part, drawn over. The width of eraser could also vary like 1, 3, 5px.

### Development
```bash
npm install
npm run start
```

### Tech stack used:
- React.js
- HTML5
- SASS
