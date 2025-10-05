import {type Component, lazy} from "solid-js";
import {Route, Router} from "@solidjs/router";
import {UIKitRoot} from "@tricolor/uikit-solid/src/index.tsx";

const App: Component = () => {
    return (
        <Router >
            <Route component={UIKitRoot}>
                <Route component={lazy(() => import("./pages/userSelect/Layout.tsx"))}>
                    <Route path={"/"} component={lazy(() => import("./pages/userSelect/login/Login.tsx"))} />
                    <Route path={"/signup"} component={lazy(() => import("./pages/userSelect/signup/Signup.tsx"))} />
                </Route>
            </Route>
        </Router>
    );
};

export default App;
