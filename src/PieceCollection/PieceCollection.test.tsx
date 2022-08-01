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
        uniqueId: `${mock.rows - 1}/${mock.cols - 1}`,
        row: mock.rows - 1,
        col: mock.cols - 1,
        correctPosition: {
            x: (mock.cols - 1) * mock.pieceWidth,
            y: (mock.rows - 1) * mock.pieceHeight
        }
    });
})