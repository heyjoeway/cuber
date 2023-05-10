import React from "react";
import Face, { FaceProps } from "./Face";

interface FaceRefProps extends FaceProps {
    faceRef: React.RefObject<Face>;
}

class FaceRef extends Face {
    props!: FaceRefProps;

    get face() {
        if (this.props.faceRef.current === null)
            throw new Error("FaceRef.face: faceRef.current is null (somehow????)");

        return this.props.faceRef.current.face;
    }

    set face(face) {
        if (this.props.faceRef.current === null)
            throw new Error("FaceRef.face: faceRef.current is null (somehow????)");

        this.props.faceRef.current.face = face;
    }
}

export default FaceRef;
export type { FaceRefProps };