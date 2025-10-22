import { type Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { UIKitRoot } from "@tcsw/uikit-solid/src/index.tsx";

const App: Component = () => {
    return (
        <Router>
            <Route component={UIKitRoot}>
                <Route component={lazy(() => import("./pages/userSelect/Layout.tsx"))}>
                    <Route path={"/"} component={lazy(() => import("./pages/userSelect/login/Login.tsx"))} />
                    <Route path={"/signup"} component={lazy(() => import("./pages/userSelect/signup/Signup.tsx"))} />
                </Route>
                <Route component={lazy(() => import("./pages/app/Layout.tsx"))}>
                    <Route path={"/app"} component={lazy(() => import("./pages/app/App.tsx"))} />
                    <Route path={"*"} component={lazy(() => import("./pages/notFound/Index.tsx"))} />
                </Route>
            </Route>
            <Route path={"*"} component={lazy(() => import("./pages/notFound/Index.tsx"))} />
        </Router>
    );
};

export default App;
