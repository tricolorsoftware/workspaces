import type { Component, JSX } from "solid-js";
import styles from "./UKBadge.module.scss"

const UKBadge: Component<{ children: JSX.Element; count: number }> = ({ children, count }) => {
    return (
        <div class={styles.root}>
            {children}
            {count === 1 ? (
                <div class={styles.singleCount} />
            ) : count > 1 ? (
                <div class={styles.multipleCount}>{Math.min(count, 999) === 999 ? `999+` : count}</div>
            ) : null}
        </div>
    );
};

export default UKBadge;
