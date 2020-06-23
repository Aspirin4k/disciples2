import { createRenderer } from "./renderer/renderer";
import { updater } from "./updater/updater";

const createMainLoop = (canvas) => {
    const renderer = createRenderer(canvas);

    const main = (timeFrame) => {
        window.requestAnimationFrame(main);

        renderer();
        updater(timeFrame)
    };

    return main;
};

export { createMainLoop };