import { CSSProperties } from "react";

// see https://stackoverflow.com/a/65959390/18031894 and comments
interface CSSPropertiesIncludingCustomProperties extends CSSProperties {
    [key: `--${string}`]: string | number
}

function allowCSSCustomProperties(
    styles: CSSPropertiesIncludingCustomProperties
): CSSPropertiesIncludingCustomProperties {
    return styles;
}

function validate(condition: boolean) {
    if (!condition) {
        throw Error();
    }
}

export {
    allowCSSCustomProperties,
    validate
};