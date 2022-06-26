import { render } from '@testing-library/react';
import { ImagePiece } from "./ImagePiece";

test('is an image piece', () => {
    const imagePiece = render(<ImagePiece />);
    expect(imagePiece).toBeInTheDocument();
});