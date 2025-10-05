import type { Component } from "solid-js";
import "./icon.css";
import styles from "./UKIcon.module.scss"
import clsx from "clsx";

const UKIcon: Component<{ children: string; class?: string }> = (props) => {
    return <span class={clsx(styles.root, props.class)}>{props.children}</span>;
};

export default UKIcon;
