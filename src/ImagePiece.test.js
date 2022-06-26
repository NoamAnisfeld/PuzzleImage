import { render } from '@testing-library/react';
import { ImagePiece } from "./ImagePiece";

test('is an image piece', () => {
    const imagePiece = render(<ImagePiece
        width={300}
        height={300}
        row={1}
        col={1}
        zIndexArray={[]}
    />);
    expect(imagePiece.container).toBeInTheDocument();
});