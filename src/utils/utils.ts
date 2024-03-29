import { CSSProperties, Dispatch, useRef, useState, SetStateAction } from "react";

// see https://stackoverflow.com/a/65959390/18031894 and comments
interface CSSPropertiesIncludingCustomProperties extends CSSProperties {
    [key: `--${string}`]: string | number
}

function allowCSSCustomProperties(
    styles: CSSPropertiesIncludingCustomProperties
): CSSPropertiesIncludingCustomProperties {
    return styles;
}

type Orientation = "horizontal" | "vertical";

function validate(condition: boolean) {
    if (!condition) {
        throw Error();
    }
}

// same functionality as Jest's expect(a).toBeCloseTo(b)
function isCloseTo(a: number, b: number): boolean {
    return Math.abs(a - b) < 0.005;
}

function cloneArrayOfObjects<T>(array: T[]): T[] {
    return array.map(item => (item && typeof item === 'object') ? {...item} : item);
}

class ArrayUtils {
    // forked from
    // https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
    static shuffle<T>(array: T[]): T[] {
        return array.map(item => ({ random: Math.random(), item }) )
            .sort((a, b) => a.random - b.random)
            .map(a => a.item);        
    }
}

// React custom hook
//
// Returns a value that remains stable across renders (using useState)
// The given function is called once on first render to calculate the value,
// and then called again only when the hook is called with true as it's
// second argument.
//
// This allows using values that are based on some HTTP call or randomization,
// when they need to be initialized more than once during an app's lifecycle
// but not on every single render.
function useResetable<T>(func: () => T, reset = false): T {
    const ref = useRef<T>();

    if (!reset && ref.current !== undefined) {
        return ref.current;
    }

    ref.current = func();
    return ref.current;
}

// Same but with a state. If called with true as the second argument and it's
// not the actual initialization of the state - calls setState() to
// reinitialize the value. Then setState() is suspended for one render to
// prevent an infinite loop.
function useResetableState<S>(initialState: S | (() => S), reset: boolean):
    // for some reason "ReturnType<typeof useState<S>>" throws an error
    [S, Dispatch<SetStateAction<S>>] {

    const [state, setState] = useState(initialState);

    const suspend = useRef(true);

    if (reset && !suspend.current) {
        suspend.current = true;
        setState(initialState);
    } else {
        suspend.current = false;
    }

    return [state, setState];
}

// util types
export type {
    Orientation,
}

// util functions
export {
    allowCSSCustomProperties,
    validate,
    isCloseTo,
    cloneArrayOfObjects,
    ArrayUtils,
}

// util custom hooks
export {
    useResetable,
    useResetableState,
}