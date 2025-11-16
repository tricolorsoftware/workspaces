import type {Component} from "solid-js";
import styles from "./UKExtendedFloatingActionButton.module.scss";
import clsx from "clsx";
import UKIcon from "../icon/UKIcon";

const UKExtendedFloatingActionButton: Component<{size: "small" | "medium" | "large"; children: string; class?: string, leadingIcon?: string, color: "primary" | "secondary" | "tertiary" | "tonal-primary" | "tonal-secondary" | "tonal-tertiary"}> = (props) => {
    return (
        <button class={clsx(styles.root, props.class)} data-size={props.size} data-color={props.color}>
            {
                props.leadingIcon && <UKIcon class={styles.icon}>{props.leadingIcon}</UKIcon>
            }
            {props.children}
        </button>
    );
};

export default UKExtendedFloatingActionButton;
