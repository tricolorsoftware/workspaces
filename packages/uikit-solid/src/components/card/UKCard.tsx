import { type Component, type JSX } from "solid-js";
import clsx from "clsx";
import type { CardColor } from "./lib/color";
import styles from "./UKCard.module.scss"

const UKCard: Component<{ children: JSX.Element; class?: string; color?: CardColor }> = (props) => {
    return (
        <div data-color={props.color || "filled"} class={clsx(styles.root, props.class)}>
            {props.children}
        </div>
    );
};

export default UKCard;
