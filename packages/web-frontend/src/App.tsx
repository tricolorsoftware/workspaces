import { type Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";

const App: Component = () => {
    return <Router>
        <Route path={"/"} component={lazy(() => import("./pages/userSelect/UserSelect.tsx"))}/>
    </Router>
}

export default App;
