import { type Component } from "solid-js";
import {Route} from "@solidjs/router";
import RootPage from "./pages/root/Index";
import SearchPage from "./pages/search/Index";
import CategoriesPage from "./pages/categories/Index";
import ManageInstalledPage from "./pages/manage-installed/Index";
import Layout from "./Layout";

const App: Component = () => {
    return (
        <Route component={Layout}>
            <Route path="/" component={RootPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/manage-installed" component={ManageInstalledPage} />
        </Route>
    );
};

export default App;
