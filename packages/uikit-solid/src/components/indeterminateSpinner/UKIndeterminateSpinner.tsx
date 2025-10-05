import type { Component } from "solid-js";
import spinnerImage from "./spinner.svg";
import styles from "./UKIndeterminateSpinner.module.scss";

const UKIndeterminateSpinner: Component = () => {
    return (
        <div class={styles.root}>
            <img class={styles.image} src={spinnerImage} />
        </div>
    );
};

export default UKIndeterminateSpinner;
