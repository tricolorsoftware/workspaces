import { type Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { UIKitRoot } from "@tricolor/uikit-solid/src/index.tsx";

const App: Component = () => {
    return <Router>
        <Route component={UIKitRoot}>
            <Route path={"/"} component={lazy(() => import("./pages/userSelect/UserSelect.tsx"))}/>
        </Route>
    </Router>
}

export default App;
