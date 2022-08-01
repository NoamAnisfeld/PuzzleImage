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

// same functionality as Jest's expect(a).toBeCloseTo(b)
function isCloseTo(a: number, b: number): boolean {
    return Math.abs(a - b) < 0.005;
}

export {
    allowCSSCustomProperties,
    validate,
    isCloseTo
};