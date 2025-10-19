import { For, type Component, type JSX, type ParentProps } from "solid-js";
import UKAvatar from "../avatar/UKAvatar";
import styles from "./UKNavigationRail.module.scss";
import UKNavigationRailItem from "./item/UKNavigationRailItem";

const UKNavigationRail: Component<
    ParentProps<{
        anchorPoints?: {
            top?: JSX.Element;
            bottom?: JSX.Element;
        };
        floatingActionButtons?: {
            icon: string;
            label: string;
            onClick: () => void;
        }[];
        items?: {
            icon: string;
            label: string;
            onClick: () => void;
            badgeCount?: number;
            active?: boolean;
        }[];
        expanded?: boolean;
        type?: "modal" | "surface";
    }>
> = (props) => {
    return (
        <div class={styles.layout}>
            <div class={styles.root} data-type={props.type || "modal"} data-expanded={props.expanded || false}>
                {props.anchorPoints?.top}
                <For each={props.items}>{(i) => <UKNavigationRailItem expanded={props.expanded || false} {...i} />}</For>
                {props.anchorPoints?.bottom}
            </div>
            <div class={styles.pageRoot}>{props.children}</div>
        </div>
    );
};

export default UKNavigationRail;
