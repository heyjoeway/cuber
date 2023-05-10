import React from 'react';
import './App.scss';

interface TileProps {
  colorID: number;
  onClick?: () => void;
  visible?: boolean;
}

function Tile(props: TileProps): JSX.Element {
  let colors = ["red", "green", "blue", "orange", "yellow", "purple"];
  let color = colors[props.colorID];
  return (
    <div
      onClick={props.onClick}
      style={{
        background: color,
        opacity: props.visible ? 1 : 0
      }}
      className="game-tile"
    >
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="game-row">
      {children}
    </div>
  );
}

interface FaceState {
  face: number[][];
  faceChangedPrev: boolean[][]; // used for animation
  animation: "none" | "rotate-cw" | "rotate-ccw" | "up" | "down" | "left" | "right";
  keyIncrement: number;
}

interface FaceProps {
  value?: number;
  visible?: boolean;
  tilt?: "none" | "left" | "right" | "up" | "down" | "test1" | "test2";
  onTileClick?: (rowIndex: number, colIndex: number) => void;
}

class Face extends React.Component {
  state: FaceState;
  props!: FaceProps;

  constructor(props: FaceProps) {
    super(props);
    let value = props.value || 0;
    this.state = {
      face: [
        [value, value, value],
        [value, value, value],
        [value, value, value]
      ],
      faceChangedPrev: [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ],
      animation: "none",
      keyIncrement: 0
    };
  }

  addKeyIncrement(): void {
    this.setState({ keyIncrement: this.state.keyIncrement + 1 });
  }

  get face(): number[][] { return structuredClone(this.state.face); }
  set face(face) { this.setState({ face: face }); }

  set animation(animation: FaceState["animation"]) {
    this.setState({ animation: animation });
    this.addKeyIncrement(); // force re-render
  }

  _clearFaceChangedPrev(): void {
    this.setState({
      faceChangedPrev: [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ]
    });
  }

  _setAllFaceChangedPrev(): void {
    this.setState({
      faceChangedPrev: [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ]
    });
  }

  _handleTileClick(rowIndex: number, colIndex: number): void {
    if (this.props.onTileClick)
      this.props.onTileClick(rowIndex, colIndex);
  }

  getRow(rowIndex: number): number[] {
    return this.face[rowIndex];
  }

  setRow(rowIndex: number, rowData: number[], animation: FaceState["animation"] = "none"): void {
    let face = this.face;
    let faceChanged = [
      [false, false, false],
      [false, false, false],
      [false, false, false]
    ];

    for (let i = 0; i < rowData.length; i++) {
      face[rowIndex][i] = rowData[i];
      faceChanged[rowIndex][i] = true;
    }

    this.face = face;
    this.setState({ faceChangedPrev: faceChanged });
    this.animation = animation;
  }

  getCol(colIndex: number): number[] {
    let face = this.face;
    let colData = [];

    for (let i = 0; i < face.length; i++)
      colData.push(face[i][colIndex]);

    return colData;
  }

  setCol(colIndex: number, colData: number[], animation: FaceState["animation"] = "none"): void {
    let face = this.face;
    let faceChanged = [
      [false, false, false],
      [false, false, false],
      [false, false, false]
    ];

    for (let i = 0; i < colData.length; i++) {
      face[i][colIndex] = colData[i];
      faceChanged[i][colIndex] = true;
    }

    this.face = face;
    this.setState({ faceChangedPrev: faceChanged });
    this.animation = animation;
  }

  rotateClockwise(): void {
    let face = this.face;
    let faceRotated = [
      [face[2][0], face[1][0], face[0][0]],
      [face[2][1], face[1][1], face[0][1]],
      [face[2][2], face[1][2], face[0][2]]
    ];
    this.face = faceRotated;
    this._setAllFaceChangedPrev();
    this.animation = "rotate-cw";
  }

  rotateCounterClockwise(): void {
    let face = this.face;
    let faceRotated = [
      [face[0][2], face[1][2], face[2][2]],
      [face[0][1], face[1][1], face[2][1]],
      [face[0][0], face[1][0], face[2][0]]
    ];
    this.face = faceRotated;
    this._setAllFaceChangedPrev();
    this.animation = "rotate-ccw";
  }

  renderFace(): JSX.Element | null {
    if (this.props.visible === false) // yes we need this because visible might not be defined
      return null; 

    let tiltClass = "tilt-" + (this.props.tilt || "none");
    let divContents = [];
    for (let y = 0; y < 3; y++) {
      let rowContents = [];
      for (let x = 0; x < 3; x++) {
        rowContents.push(
          <Tile
            key={ `${y}-${x}` }
            onClick={ () => this._handleTileClick(y, x) }
            colorID={ this.state.face[y][x] }
            visible={ !this.state.faceChangedPrev[y][x] }
          />
        );
      }
      divContents.push(
        <Row key={ y }>
        {rowContents}
        </Row>
      );
    }
    return (
      <div
        className={`game-face ${tiltClass}`}
        key={ this.state.keyIncrement }
      >
        {divContents}
      </div>
    );
  }

  renderFaceAnimation(): JSX.Element | null {
    if (this.props.visible === false) // yes we need this because visible might not be defined
      return null; 

    let tiltClass = "tilt-" + (this.props.tilt || "none");
    let divContents = [];
    for (let y = 0; y < 3; y++) {
      let rowContents = [];
      for (let x = 0; x < 3; x++) {
        rowContents.push(
          <Tile
            key={ `${y}-${x}` }
            colorID={ this.state.face[y][x] }
            visible={ this.state.faceChangedPrev[y][x] }
          />
        );
      }
      divContents.push(
        <Row key={ y }>
        {rowContents}
        </Row>
      );
    }
    return (
      <div
        className={`game-face game-face-anim ${tiltClass} anim-${this.state.animation}`}
        key={ `${this.state.keyIncrement}-anim` }
        style={ { pointerEvents: "none" } }
      >
        {divContents}
      </div>
    );
  }

  render(): JSX.Element | null {
    return (
      <React.Fragment>
        { this.renderFaceAnimation() }
        { this.renderFace() }
      </React.Fragment>
    );
  }

}

interface FaceRefProps extends FaceProps {
  faceRef: React.RefObject<Face>;
}

class FaceRef extends Face {
  props!: FaceRefProps;

  get face() {
    console.log("FaceRef.face getter");
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

interface BoardProps { }

declare global {
  interface Window { test: any; }
}

class Board extends React.Component {
  _board: (React.RefObject<Face> | null)[][];

  constructor(props: BoardProps) {
    super(props);

    window.test = this;

    let faceRefs = [
      React.createRef<Face>(),
      React.createRef<Face>(),
      React.createRef<Face>(),
      React.createRef<Face>(),
      React.createRef<Face>(),
      React.createRef<Face>(),
      React.createRef<Face>()
    ];

    this._board = [
      [faceRefs[0], faceRefs[1], faceRefs[2], faceRefs[3]],
      [faceRefs[4],        null,        null,        null],
      [faceRefs[5],        null,        null,        null],
      [faceRefs[6],        null,        null,        null]
    ];
  }

  getFaceRef(y: number, x: number): React.RefObject<Face> {
    let faceRef = this._board[y][x];
    if (faceRef === null)
      throw new Error("Board.getFaceRef: faceRef is null (somehow????)");

    return faceRef;
  }

  getFace(y: number, x: number): Face {
    let faceRef = this.getFaceRef(y, x);

    if (faceRef === null)
      throw new Error("Board.getFace: faceRef is null (somehow????)");

    if (faceRef.current === null)
      throw new Error("Board.getFace: faceRef.current is null (somehow????)");

    return faceRef.current;
  }

  rotateRowRight(rowIndex: number): void {
    let lastFaceRowData = this.getFace(0, 3).getRow(rowIndex);

    for (let i = 1; i <= 3; i++) 
      this.getFace(0, i).setRow(
        rowIndex,
        this.getFace(0, i - 1).getRow(rowIndex),
        "right"
      );

    this.getFace(0, 0).setRow(
      rowIndex,
      lastFaceRowData,
      "right"
    )

    if (rowIndex === 0) {
      this.getFace(3, 0).rotateCounterClockwise();
    } else if (rowIndex === 2) {
      this.getFace(1, 0).rotateClockwise();
    } 
  }

  rotateRowLeft(rowIndex: number): void {
    let firstFaceRowData = this.getFace(0, 0).getRow(rowIndex);

    for (let i = 3; i >= 1; i--)
      this.getFace(0, i - 1).setRow(
        rowIndex,
        this.getFace(0, i).getRow(rowIndex),
        "left"
      );

    this.getFace(0, 3).setRow(
      rowIndex,
      firstFaceRowData,
      "left"
    );

    if (rowIndex === 0) {
      this.getFace(3, 0).rotateClockwise();
    } else if (rowIndex === 2) {
      this.getFace(1, 0).rotateCounterClockwise();
    }
  }

  rotateColUp(colIndex: number): void {
    let firstFaceColData = this.getFace(0, 0).getCol(colIndex);

    for (let i = 3; i >= 1; i--)
      this.getFace(i - 1, 0).setCol(
        colIndex,
        this.getFace(i, 0).getCol(colIndex),
        "up"
      );

    this.getFace(3, 0).setCol(
      colIndex,
      firstFaceColData,
      "up"
    );

    if (colIndex === 0) {
      this.getFace(0, 3).rotateCounterClockwise();
    } else if (colIndex === 2) {
      this.getFace(0, 1).rotateClockwise();
    }
  }

  rotateColDown(colIndex: number): void {
    let lastFaceColData = this.getFace(3, 0).getCol(colIndex);

    for (let i = 1; i <= 3; i++)
      this.getFace(i, 0).setCol(
        colIndex,
        this.getFace(i - 1, 0).getCol(colIndex),
        "down"
      );

    this.getFace(0, 0).setCol(
      colIndex,
      lastFaceColData,
      "down"
    );

    if (colIndex === 0) {
      this.getFace(0, 3).rotateClockwise();
    } else if (colIndex === 2) {
      this.getFace(0, 1).rotateCounterClockwise();
    }
  }

  clickCenterFace(rowIndex: number, colIndex: number) {
    console.log("clickCenterFace", rowIndex, colIndex);
  }
  clickTopFace(rowIndex: number, colIndex: number) {
    this.rotateColUp(colIndex);
  }
  clickBottomFace(rowIndex: number, colIndex: number) {
    this.rotateColDown(colIndex);
  }
  clickLeftFace(rowIndex: number, colIndex: number) {
    this.rotateRowLeft(rowIndex);
  }
  clickRightFace(rowIndex: number, colIndex: number) {
    this.rotateRowRight(rowIndex);
  }

  render(): JSX.Element {
    return (
      <div className="game-container">
        <Face
          value={ 0 }
          ref={ this.getFaceRef(0, 0) }
          onTileClick={ this.clickCenterFace.bind(this) }
          />
        <Face
          value={ 1 }
          ref={ this.getFaceRef(0, 1) }
          tilt="right"
          onTileClick={ this.clickRightFace.bind(this) }
        />
        <FaceRef
          ref={ (this.getFaceRef(0, 2) as React.RefObject<FaceRef>) }
          faceRef={ this.getFaceRef(2, 0) }
          visible={ false }
        />
        <Face
          value={ 2 }
          ref={ this.getFaceRef(0, 3) }
          tilt="left"
          onTileClick={ this.clickLeftFace.bind(this) }
          />
        <Face
          value={ 3 }
          ref={ this.getFaceRef(1, 0) }
          tilt="down"
          onTileClick={ this.clickBottomFace.bind(this) }
        />
        <Face
          value={ 4 }
          ref={ this.getFaceRef(2, 0) }
          tilt="test2"
        />
        <Face
          value={ 5 }
          ref={ this.getFaceRef(3, 0) }
          tilt="up"
          onTileClick={ this.clickTopFace.bind(this) }
        />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;