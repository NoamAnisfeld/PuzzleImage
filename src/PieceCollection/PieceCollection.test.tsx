import { ModuleDetectionKind } from "typescript";
import { exportedForTesting } from "./PieceCollection";

const {
    createPieceMapping
} = exportedForTesting;

test('createPieceMapping', () => {
    const mock = {
        rows: 4,
        cols: 3,
        pieceWidth: 100,
        pieceHeight: 50
    }

    const mapping = createPieceMapping(mock);
    
    expect(Object.keys(mapping).length).toBe(mock.rows * mock.cols);

    const expectedLastKey = `${mock.rows - 1}/${mock.cols - 1}`;
    expect(mapping[expectedLastKey]).toMatchObject ({
        row: mock.rows - 1,
        col: mock.cols - 1,
        correctPosition: {
            x: (mock.cols - 1) * mock.pieceWidth,
            y: (mock.rows - 1) * mock.pieceHeight
        }
    });
})