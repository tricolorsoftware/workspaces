import type { Component } from "solid-js";
import styles from "./UKExtendedFloatingActionButton.module.scss";

const UKExtendedFloatingActionButton: Component<{ size: "small" | "medium" | "large"; children: string }> = (props) => {
    return (
        <button class={styles.root}>
            {props.children}
            {props.size}
        </button>
    );
};

export default UKExtendedFloatingActionButton;
