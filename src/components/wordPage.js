import React from "react";
import classes from "./wordPage.module.css"

const WordPage = (props) => {
    return (
        <div className={classes.mainWrapper}>
            <div className={classes.content}>
                <div className={classes.title}>{props.word}</div>
                <div className="font-light size-1 mb-3 opacity-50">Орысша</div>
            </div>
        </div>
    )
}

export default WordPage;