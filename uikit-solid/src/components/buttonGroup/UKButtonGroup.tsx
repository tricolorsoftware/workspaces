import styles from "./UKButtonGroup.module.scss"
import { type Component, type JSX } from "solid-js";
import type { ButtonSize } from "../button/lib/size.ts";

// FIXME: this is not correctly implemented according to the MV3 Spec

const UKButtonGroup: Component<{
    children: JSX.Element;
    size: ButtonSize;
    connected?: boolean;
}> = (props) => {
    return (
        <div
            data-size={props.size}
            data-connected={props.connected}
            class={styles.root}
        >
            {props.children}
        </div>
    );
};

export default UKButtonGroup;
