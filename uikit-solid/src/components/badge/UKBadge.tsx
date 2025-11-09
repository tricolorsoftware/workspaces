import type { Component, JSX } from "solid-js";
import styles from "./UKBadge.module.scss";
import clsx from "clsx";

const UKBadge: Component<{ children: JSX.Element; count: number; class?: string }> = (props) => {
    return (
        <div class={clsx(styles.root, props.class)}>
            {props.children}
            {props.count === 1 ? (
                <div class={styles.singleCount} />
            ) : props.count > 1 ? (
                <div class={styles.multipleCount}>{Math.min(props.count, 999) === 999 ? `999+` : props.count}</div>
            ) : null}
        </div>
    );
};

export default UKBadge;
