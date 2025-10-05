import { type Component, type JSX } from "solid-js";
import styles from "./UKCheckbox.module.scss"

const UKCheckbox: Component<{ children: JSX.Element }> = (props) => {
    return (
        <input type={"checkbox"} class={styles.root}>
            {props.children}
        </input>
    );
};

export default UKCheckbox;
