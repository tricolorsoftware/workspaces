import { type Component } from "solid-js";
import RootPage from "./pages/root";
import { Route } from "@solidjs/router";
import Layout from "./Layout";

const App: Component = () => {
    return (
        <>
            <Route component={Layout}>
                <Route path={"/"} component={RootPage} />
                <Route path={"/profile"} component={RootPage} />
                <Route path={"/storage"} component={RootPage} />
                <Route path={"/customization"} component={RootPage} />
                <Route path={"/instance"} component={RootPage} />
            </Route>
        </>
    );
};

export default App;
