import { type Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { UIKitRoot } from "@tcsw/uikit-solid/src/index.tsx";
import AppIndex from "./pages/app/App.tsx";
import AuthCheck from "./pages/app/AuthCheck.tsx";

const ApplicationsRouter = lazy(() => import("../../../../fs/Applications.tsx"));

const App: Component = () => {
    return (
        <Router>
            <Route component={UIKitRoot}>
                <Route component={lazy(() => import("./pages/userSelect/Layout.tsx"))}>
                    <Route path={"/"} component={lazy(() => import("./pages/userSelect/login/Login.tsx"))} />
                    <Route path={"/signup"} component={lazy(() => import("./pages/userSelect/signup/Signup.tsx"))} />
                    <Route
                        path={"/forgot-password"}
                        component={lazy(() => import("./pages/userSelect/forgotPassword/ForgotPassword.tsx"))}
                    />
                </Route>
                <Route component={AuthCheck}>
                    <Route component={lazy(() => import("./pages/app/Layout.tsx"))}>
                        <Route path={"app"}>
                            <Route path={"/"} component={AppIndex} />
                            <ApplicationsRouter />
                        </Route>
                        <Route path={"*"} component={lazy(() => import("./pages/notFound/Index.tsx"))} />
                    </Route>
                </Route>
            </Route>
            <Route path={"*"} component={lazy(() => import("./pages/notFound/Index.tsx"))} />
        </Router>
    );
};

export default App;
