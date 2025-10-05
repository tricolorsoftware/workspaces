import type { Component } from "solid-js";
import { DividerDirection } from "./lib/direction.ts";
import styles from "./UKDivider.module.scss"

const UKDivider: Component<{
    direction: DividerDirection;
    width?: "inset" | "middle-inset" | "full";
}> = (props) => {
    if (props.width === "inset" && props.direction === DividerDirection.vertical) {
        console.warn("A divider cannot be both vertical and inset");
    }

    return <div data-direction={props.direction || DividerDirection.horizontal} data-width={props.width || "full"} class={styles.root} />;
};

export default UKDivider;
