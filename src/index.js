import { createMainLoop } from "./main";

import './../styles/base.css';

if(typeof(module.hot) !== 'undefined') {
    module.hot.accept();
}

document.onclick = () => {
    document.onclick = () => false;

    const canvas = document.getElementById('game-scene');
    const main = createMainLoop(document, canvas);

    main();
}