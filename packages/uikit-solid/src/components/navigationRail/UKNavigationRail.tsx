import { Index, type Component, type JSX, type ParentProps } from "solid-js";
import styles from "./UKNavigationRail.module.scss";
import UKNavigationRailItem from "./item/UKNavigationRailItem";
import UKNavigationRailMenuButton from "./menuButton/UKNavigationRailMenuButton";

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
            imageIcon?: string;
            label: string;
            onClick: () => void;
            badgeCount?: number;
            active?: boolean;
        }[];
        expanded?: boolean;
        setExpanded?: (expanded: boolean) => void;
        type?: "modal" | "surface";
    }>
> = (props) => {
    return (
        <div class={styles.layout}>
            <div class={styles.root} data-type={props.type || "modal"} data-expanded={props.expanded || false}>
                {props.setExpanded && <UKNavigationRailMenuButton setExpanded={props.setExpanded} expanded={props.expanded || false} />}
                {props.anchorPoints?.top}
                <Index each={props.items}>{(i) => <UKNavigationRailItem expanded={props.expanded || false} {...i()} />}</Index>
                {props.anchorPoints?.bottom}
            </div>
            <div class={styles.pageRoot}>{props.children}</div>
        </div>
    );
};

export default UKNavigationRail;
