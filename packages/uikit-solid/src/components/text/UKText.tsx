import type { Component } from "solid-js";
import styles from "./UKText.module.scss";
import clsx from "clsx";

const UKText: Component<{
    role: "display" | "headline" | "title" | "body" | "label";
    emphasized?: boolean;
    size: "l" | "m" | "s";
    align?: "start" | "center" | "end";
    children: string;
    class?: string;
}> = (props) => {
    return (
        <div
            class={clsx(styles.root, props.class)}
            data-size={props.size || "s"}
            data-role={props.role || "body"}
            data-emphasized={props.emphasized || false}
            data-align={props.align || "start"}
        >
            {props.children}
        </div>
    );
};

export default UKText;
