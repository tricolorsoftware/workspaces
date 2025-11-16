import type { Component } from "solid-js";
import UKIcon from "../icon/UKIcon";
import UKText from "../text/UKText";
import styles from "./UKChip.module.scss";
import clsx from "clsx";

const UKChip: Component<{
    type: "assist" | "filter" | "input" | "suggestion";
    children: string;
    class?: string;
    leadingIcon?: string;
    trailingIcon?: string;
}> = (props) => {
    return (
        <div class={clsx(styles.root, props.class)} data-type={props.type} data-noLeadingIcon={!props.leadingIcon} data-noTrailingIcon={!props.trailingIcon}>
            {props.leadingIcon && <UKIcon class={styles.icon}>{props.leadingIcon}</UKIcon>}
            <UKText role="label" size="m" emphasized={false} class={styles.label}>
                {props.children}
            </UKText>
            {props.trailingIcon && <UKIcon class={styles.icon}>{props.trailingIcon}</UKIcon>}
        </div>
    );
};

export default UKChip;
