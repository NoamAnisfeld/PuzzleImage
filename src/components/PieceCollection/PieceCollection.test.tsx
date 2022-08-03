import { ModuleDetectionKind } from "typescript";
import { exportedForTesting } from "./PieceCollection";

const {
    createPieceInfoArray
} = exportedForTesting;

test('createPieceInfoArray', () => {
    const mock = {
        rows: 4,
        cols: 3,
        pieceWidth: 100,
        pieceHeight: 50
    }

    const array = createPieceInfoArray(mock);
    
    expect(array.length).toBe(12);

    expect(array[11]).toMatchObject ({
        uniqueId: '3/2',
        row: 3,
        col: 2,
        correctPosition: {
            x: 200,
            y: 150
        }
    });
})