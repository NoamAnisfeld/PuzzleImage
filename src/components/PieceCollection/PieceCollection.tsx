import { useContext, useEffect, useReducer } from "react";
import { GlobalState } from "../../GlobalState/GlobalState";
import ImagePiece, { Position } from "../ImagePiece/ImagePiece";
import {
    fractionalToAbsolutePosition,
    absoluteToFractionalPosition,
    createPieceInfoArray,
    isPositionCorrect
} from "./PieceCollection.utils";
import { extractPieceOutlinePath, SVGPathsGrid } from '../../utils/SVGCurvePaths';
import { cloneArrayOfObjects, useResetableState } from '../../utils/utils';

function PieceCollection({
    svgPathsGrid,
    imageCompletedCallback,
    isRestarting,
}: {
    svgPathsGrid: SVGPathsGrid,
    imageCompletedCallback: () => void,
    isRestarting: boolean,
}) {
    const {
        imageWidth,
        imageHeight,
        pieceWidth,
        pieceHeight,
        curveSize,
        rows,
        cols
    } = useContext(GlobalState);

    const [pieceInfoArray, setPieceInfoArray] = useResetableState(() =>
            createPieceInfoArray({
                rows,
                cols,
            }),
            isRestarting
        );
    
    function updatePiecePosition(uniqueId: string, newAbsolutePosition: Position) {
        const newArray = cloneArrayOfObjects(pieceInfoArray);        
        const piece = newArray.find(value => value.uniqueId === uniqueId);
        if (!piece) {
            console.warn('Unexpected uniqueId');
            return;
        }
        piece.fractionalPosition = absoluteToFractionalPosition(
            newAbsolutePosition,
            {
                imageWidth,
                imageHeight
            }
        );

        setPieceInfoArray(newArray);
    }

    function unhideFirstInvisiblePiece() {
        setPieceInfoArray(oldArray => {
            const newArray = cloneArrayOfObjects(oldArray),
                firstInvisiblePiece = newArray.find(piece => !piece.visible);

            if (firstInvisiblePiece) {
                firstInvisiblePiece.visible = true;
                putPieceOnTop(firstInvisiblePiece.uniqueId);
            }

            return newArray;
        });
    }

    function putPieceOnTopLogic(oldZIndexSorter: string[], pieceKey: string): string[] {
        const newZIndexSorter = Array.from(oldZIndexSorter);
        const index = newZIndexSorter.indexOf(pieceKey);

        if (index !== -1) {
            newZIndexSorter.splice(index, 1);
        }
        newZIndexSorter.push(pieceKey);

        return newZIndexSorter;
    }

    const [zIndexSorter, putPieceOnTop] = useReducer(putPieceOnTopLogic, []);

    const [isImageCompleted, setIsImageCompleted] =
        useResetableState(false, isRestarting);
    if (!isImageCompleted && pieceInfoArray.every(isPositionCorrect)) {
        setIsImageCompleted(true);
    }

    useEffect(() => {
        const box = document.getElementById("pieces-box"),
            listener = () => {
                unhideFirstInvisiblePiece();
            };

        box.addEventListener('click', listener);
        return () => {
            box.removeEventListener('click', listener)
        };
    }, [unhideFirstInvisiblePiece]);

    useEffect(() => {
        if (isImageCompleted) {
            imageCompletedCallback();
        }
    }, [isImageCompleted]);

    return <>
        {pieceInfoArray.map(pieceInfo => {
            const { uniqueId, row, col, fractionalPosition, visible } = pieceInfo;

            return visible ? <ImagePiece
                {...{
                    uniqueId,
                    key: uniqueId,
                    imageOffset: {
                        x: pieceWidth * col - curveSize,
                        y: pieceHeight * row - curveSize
                    },
                    shapePath: extractPieceOutlinePath({
                        grid: svgPathsGrid,
                        row,
                        col,
                        pieceWidth,
                        pieceHeight,
                        curveSize
                    }),
                    row,
                    col,
                    position: fractionalToAbsolutePosition(
                        fractionalPosition,
                        {
                            imageWidth,
                            imageHeight
                        }
                    ),
                    isImageCompleted,
                }}
                updatePosition={(newAbsolutePosition: Position) =>
                    updatePiecePosition(uniqueId, newAbsolutePosition)}
                zIndex={
                    (n => n === -1 ? null : n + 1)
                        (zIndexSorter.indexOf(uniqueId))
                }
                putOnTop={() => putPieceOnTop(uniqueId)}
            /> : undefined
        })}
    </>
}

export default PieceCollection;