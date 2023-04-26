import React from 'react';
import './App.scss';

function Tile({ colorID }) {
  let colors = ["red", "green", "blue", "orange", "yellow", "purple"];
  let color = colors[colorID];
  return (
    <div style={{ background: color }} className="game-tile"></div>
  );
}

function Row({ children }) {
  return (
    <div className="game-row">
      {children}
    </div>
  );
}

class Face extends React.Component {
  constructor(props) {
    super(props);
    let value = props.value || 0;
    this.state = {
      face: [
        [value, value, value],
        [value, value, value],
        [value, value, value]
      ]
    };
  }

  get face() {
    return structuredClone(this.state.face);
  }

  set face(face) {
    this.setState({ face: face });
  }

  getRow(rowIndex) {
    return this.face[rowIndex];
  }

  setRow(rowIndex, rowData) {
    let face = this.face;

    for (let i = 0; i < rowData.length; i++)
      face[rowIndex][i] = rowData[i];

    this.face = face;
  }

  getCol(colIndex) {
    let face = this.face;
    let colData = [];

    for (let i = 0; i < face.length; i++)
      colData.push(face[i][colIndex]);

    return colData;
  }

  setCol(colIndex, colData) {
    let face = this.face;

    for (let i = 0; i < colData.length; i++)
      face[i][colIndex] = colData[i];

    this.face = face;
  }

  rotateClockwise() {
    let face = this.face;
    let faceRotated = [
      [face[2][0], face[1][0], face[0][0]],
      [face[2][1], face[1][1], face[0][1]],
      [face[2][2], face[1][2], face[0][2]]
    ];
    this.face = faceRotated;
  }

  rotateCounterClockwise() {
    let face = this.face;
    let faceRotated = [
      [face[0][2], face[1][2], face[2][2]],
      [face[0][1], face[1][1], face[2][1]],
      [face[0][0], face[1][0], face[2][0]]
    ];
    this.face = faceRotated;
  }

  render() {
    if (this.props.visible === false) // yes we need this because visible might not be defined
      return null;

    let tiltClass = "tilt-" + (this.props.tilt || "none");
    return (
      <div className={`game-face ${tiltClass}`}>
        <Row>
          <Tile colorID={ this.state.face[0][0] } />
          <Tile colorID={ this.state.face[0][1] } />
          <Tile colorID={ this.state.face[0][2] } />
        </Row>
        <Row>
          <Tile colorID={ this.state.face[1][0] } />
          <Tile colorID={ this.state.face[1][1] } />
          <Tile colorID={ this.state.face[1][2] } />
        </Row>
        <Row>
          <Tile colorID={ this.state.face[2][0] } />
          <Tile colorID={ this.state.face[2][1] } />
          <Tile colorID={ this.state.face[2][2] } />
        </Row>
      </div>
    )
  }
}

class FaceRefFlipped extends Face {
  get face() {
    let face = this.props.faceRef.current.face;
    return face.slice().reverse();
  }

  set face(face) {
    this.props.faceRef.current.face = face.slice().reverse();
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    window.test = this;

    let faceRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef()
    ];

    this._board = [
      [faceRefs[0], faceRefs[1], faceRefs[2], faceRefs[3]],
      [faceRefs[4],        null,        null,        null],
      [faceRefs[5],        null,        null,        null],
      [faceRefs[6],        null,        null,        null]
    ];
  }

  getFaceRef(y, x) {
    return this._board[y][x];
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {Face}
   */
  getFace(y, x) {
    return this.getFaceRef(y, x).current;
  }

  /** 
    * @param {number} row
   */
  rotateRowRight(rowIndex) {
    let lastFaceRowData = this.getFace(0, 3).getRow(rowIndex);

    for (let i = 1; i <= 3; i++) 
      this.getFace(0, i).setRow(rowIndex, this.getFace(0, i - 1).getRow(rowIndex));

    this.getFace(0, 0).setRow(rowIndex, lastFaceRowData)

    if (rowIndex === 0) {
      this.getFace(3, 0).rotateCounterClockwise();
    } else if (rowIndex === 2) {
      this.getFace(1, 0).rotateClockwise();
    }
  }

  rotateRowLeft(rowIndex) {
    let firstFaceRowData = this.getFace(0, 0).getRow(rowIndex);

    for (let i = 3; i >= 1; i--)
      this.getFace(0, i - 1).setRow(rowIndex, this.getFace(0, i).getRow(rowIndex));

    this.getFace(0, 3).setRow(rowIndex, firstFaceRowData);

    if (rowIndex === 0) {
      this.getFace(3, 0).rotateClockwise();
    } else if (rowIndex === 2) {
      this.getFace(1, 0).rotateCounterClockwise();
    }
  }

  rotateColUp(colIndex) {
    let firstFaceColData = this.getFace(0, 0).getCol(colIndex);

    for (let i = 3; i >= 1; i--)
      this.getFace(i - 1, 0).setCol(colIndex, this.getFace(i, 0).getCol(colIndex));

    this.getFace(3, 0).setCol(colIndex, firstFaceColData);

    if (colIndex === 0) {
      this.getFace(0, 1).rotateClockwise();
    } else if (colIndex === 2) {
      this.getFace(0, 3).rotateCounterClockwise();
    }
  }

  rotateColDown(colIndex) {
    let lastFaceColData = this.getFace(3, 0).getCol(colIndex);

    for (let i = 1; i <= 3; i++)
      this.getFace(i, 0).setCol(colIndex, this.getFace(i - 1, 0).getCol(colIndex));

    this.getFace(0, 0).setCol(colIndex, lastFaceColData);

    if (colIndex === 0) {
      this.getFace(0, 1).rotateCounterClockwise();
    } else if (colIndex === 2) {
      this.getFace(0, 3).rotateClockwise();
    }
  }

  render() {
    return (
      <div className="game-container">
        <Face value={ 0 } ref={ this.getFaceRef(0, 0) } />
        <Face value={ 1 } ref={ this.getFaceRef(0, 1) } tilt="right" />
        <FaceRefFlipped   ref={ this.getFaceRef(0, 2) } faceRef={ this.getFaceRef(2, 0) } visible={ false } />
        <Face value={ 2 } ref={ this.getFaceRef(0, 3) } tilt="left" />
        <Face value={ 3 } ref={ this.getFaceRef(1, 0) } tilt="up" />
        <Face value={ 4 } ref={ this.getFaceRef(2, 0) } visible={ false } />
        <Face value={ 5 } ref={ this.getFaceRef(3, 0) } tilt="down" />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Board />
      <span>hi</span>
    </div>
  );
}

export default App;
