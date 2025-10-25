import { lazy } from "solid-js";

const Widgets = {
    user: {
        profile: lazy(() => import("./user/profile/Widget")),
    },
};

export default Widgets;
