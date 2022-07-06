import { render } from '@testing-library/react';
import { ImagePieceCollection } from "./ImagePieces";

test('total number of pieces matches rows and columns', () => {
    const ImagePieceCollection = render(<ImagePieceCollection
        container={document.createElement('div')}
        imageWidth={300}
        imageHeight={300}
        rows={3}
        cols={2}
        curveSize={30}
    />);
    expect(imagePiece.container).toBeInTheDocument();
});