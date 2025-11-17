import { type Component } from "solid-js";
import { Route, Router } from "@solidjs/router";
import RootPage from "./pages/root/page";

const App: Component = () => {
    return (
        <>
            <Route path="/" component={RootPage} />
        </>
    );
};

export default App;
