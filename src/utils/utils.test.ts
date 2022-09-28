import { assert } from 'console';
import {
    allowCSSCustomProperties,
    validate,
    isCloseTo,
    useResetable,
    useResetableState,
    ArrayUtils,
} from './utils' ;

test('ArrayUtils.shuffle', () => {
    const originalArray = [1, 3, 7, 10, 2000, 2, -4, 2, 5, 'a'],
        shuffledArray = ArrayUtils.shuffle(originalArray);
    
    // would fail in the rare case of shuffle result being in original order
    expect(shuffledArray).not.toEqual(originalArray);
    
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
})