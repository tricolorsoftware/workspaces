import { type Component } from "solid-js";
import Widgets from "./widgets/widgets";

const App: Component = () => {
    return (
        <>
            <Widgets.user.profile />
        </>
    );
};

export default App;
