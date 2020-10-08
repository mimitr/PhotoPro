import React, { Component } from "react";

class ImageSquare extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageSquare

    this.imageRef = React.createRef();
    this.state = { spans: 0 };
  }

  /*componentDidMount() {
    console.log(this.imageRef);
    //console.log(this.imageRef.current.clientHeight);

    setSpans = () => {
      console.log(this.imageRef.current.clientHeight);
    };
  }*/
  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
    // console log the height of the images
    // console.log(this.imageRef.current.clientHeight);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    //const spansRows = Math.ceil(height / 150);
    const spansRows = Math.ceil(height / 10);
    this.setState({ spans: spansRows });
  };

  render() {
    return (
      <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <img
          ref={this.imageRef}
          src={`data:image/jpg;base64,${this.props.image.img}`}
          alt={this.props.image.caption}
        />
      </div>
    );
  }
}

export default ImageSquare;
