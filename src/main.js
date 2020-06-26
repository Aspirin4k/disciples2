import { createRenderer } from "./renderer/renderer";
import { updater } from "./updater/updater";

const createMainLoop = (document, canvas) => {
    const renderer = createRenderer(document, canvas);

    const main = (timeFrame) => {
        window.requestAnimationFrame(main);

        renderer();
        updater(timeFrame)
    };

    return main;
};

export { createMainLoop };