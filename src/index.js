import { createMainLoop } from "./main";

import './../styles/base.css';

if(typeof(module.hot) !== 'undefined') {
    module.hot.accept();
}

const canvas = document.getElementById('game-scene');
const main = createMainLoop(canvas);

main();