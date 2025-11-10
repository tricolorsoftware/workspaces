import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";

const AppIndex: Component = () => {
    const navigate = useNavigate();

    // this should be a tRPC request to allow the user to change it
    navigate("/app/uk.tcsw.dashboard");

    return <></>;
};

export default AppIndex;
