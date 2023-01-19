import { Fragment, useEffect, useState, useRef } from "react";

import { HalfMalf } from "../lib/spinner-loader/index";
import "../lib/spinner-loader/index.css";

export default function ImageLabelBox({ image_file, w, x, y, z }) {
  const imageRef = useRef(false);

  console.log("image", imageRef.current?.complete);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [isImageLoading, setImageLoading] = useState(false);

  const calculateImageBoundingBox = () => {

    console.log("Image Width", imageWidth);
    console.log("Image Height", imageHeight);

    let xCenter = parseFloat(w * imageWidth);
    let yCenter = parseFloat(x * imageHeight);

    let xWidth = parseFloat(y * imageWidth);
    let xHeight = parseFloat(z * imageHeight);

    let _x = parseInt(xCenter - xWidth / 2);
    let _y = parseInt(yCenter - xHeight / 2);

    console.log(xWidth, xHeight, _x, _y);

    return (
      <div
        style={{
          top: `10px`,
          left: `20px`,
          width: `${xWidth}px`,
          height: `${xHeight}px`,
          backgroundColor: "#0096ff10",
          position: "absolute",
          border: "1px solid #0096ff",
        }}
      ></div>
    );
  };

  return (
    <Fragment>
      <div style={{ position: "relative" }}>
        <img
          onLoad={(event) => {
            setImageWidth(event.target.naturalWidth);
            setImageHeight(event.target.naturalHeight);
          }}
          ref={imageRef}
          className="img-fluid"
          alt="image View"
          src={image_file}
        />
        {imageRef.current?.complete ? (
          calculateImageBoundingBox(imageWidth, imageHeight)
        ) : (
          <h1>Image Loading Error!</h1>
        )}
        {imageWidth && imageHeight && (
          <span>
            {imageHeight} x {imageWidth}
          </span>
        )}
      </div>
    </Fragment>
  );
}
