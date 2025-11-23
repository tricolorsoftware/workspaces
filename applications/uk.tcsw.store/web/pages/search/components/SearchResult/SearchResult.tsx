import UKCard from "@tcsw/uikit-solid/src/components/card/UKCard.jsx";
import UKIcon from "@tcsw/uikit-solid/src/components/icon/UKIcon.jsx";
import UKText from "@tcsw/uikit-solid/src/components/text/UKText.jsx";
import type {Component} from "solid-js";
import styles from "./SearchResult.module.scss"
import {useNavigate} from "@solidjs/router";

const SearchResult: Component<{bannerImage?: string, title: string, publisher: string, downloadCount?: number, id: string}> = (props) => {
    const navigate = useNavigate()

    return <UKCard onClick={() => {navigate(`/app/uk.tcsw.store/page/${props.id}`)}} color={"filled"} class={styles.root}>
        <img draggable={false} src={props.bannerImage || "/assets/tricolor/tricolor.svg"} />
        <UKText class={styles.title} role={"title"} size={"l"}>{props.title}</UKText>
        <div class={styles.footer}>
            <UKText role={"label"} size={"m"}>{props.publisher}</UKText>
            {props.downloadCount && <>
                <UKIcon class={styles.footerIcon}>download</UKIcon>
                <UKText role={"label"} size={"m"}>{props.downloadCount}</UKText>
            </>}
        </div>
    </UKCard>
}

export default SearchResult