import type { Component } from "solid-js";
import styles from "./UKNavigationRailMenuButton.module.scss";
import UKIconButton from "../../iconButton/UKIconButton";
import clsx from "clsx";

const UKNavigationRailMenuButton: Component<{ expanded: boolean; setExpanded: (expanded: boolean) => void }> = (props) => {
    return (
        <div class={styles.root}>
            <UKIconButton
                iconClass={clsx(styles.icon, props.expanded && styles.expanded)}
                color={"standard"}
                alt="toggle menu"
                onClick={() => props.setExpanded(!props.expanded)}
                icon={props.expanded ? "menu_open" : "menu"}
            />
        </div>
    );
};

export default UKNavigationRailMenuButton;
