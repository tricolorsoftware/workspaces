import { type Component } from "solid-js";
import {Route} from "@solidjs/router";
import RootPage from "./pages/root/Index";
import ManageInstalledPage from "./pages/manage-installed/Index";

const App: Component = () => {
    return (
        <>
            <Route path="/" component={RootPage} />
            <Route path="/manage-installed" component={ManageInstalledPage} />
        </>
    );
};

export default App;
