import React from "react";
import Face, { FaceProps, FaceState } from "./Face";

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

    set face(face: FaceState["face"]) {
        if (this.props.faceRef.current === null)
            throw new Error("FaceRef.face: faceRef.current is null (somehow????)");

        this.props.faceRef.current.face = face;
    }

    refresh() {
        if (this.props.faceRef.current === null)
            return; // ignore

        this.setState(this.props.faceRef.current.state);
        console.log("FaceRef.refresh: this.state = ", structuredClone(this.state));
    }

    componentDidMount(): void {
        this.refresh();
    }

    set animation(animation: Face["animation"]) {
        if (this.props.faceRef.current === null)
            return; // ignore

        this.props.faceRef.current.animation = animation;
    }

    setRow(rowIndex: number, rowData: number[], animation: FaceState["animation"] = "none"): void {
        if (this.props.faceRef.current === null)
            return; // ignore

        this.props.faceRef.current.setRow(rowIndex, rowData, animation);
    }
    setCol(colIndex: number, colData: number[], animation: FaceState["animation"] = "none"): void {
        if (this.props.faceRef.current === null)
            return; // ignore
        
        this.props.faceRef.current.setCol(colIndex, colData, animation);
    }    
}

export default FaceRef;
export type { FaceRefProps };