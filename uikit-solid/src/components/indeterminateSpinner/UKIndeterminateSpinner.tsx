import type { Component } from "solid-js";
import spinnerImage from "./spinner.svg";
import styles from "./UKIndeterminateSpinner.module.scss";
import clsx from "clsx";

const UKIndeterminateSpinner: Component<{ class?: string }> = (props) => {
    return (
        <div class={clsx(styles.root, props.class)}>
            <img class={styles.image} src={spinnerImage} />
        </div>
    );
};

export default UKIndeterminateSpinner;
