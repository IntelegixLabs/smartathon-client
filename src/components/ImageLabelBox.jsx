import { Fragment, useEffect, useState } from "react";

export default function ImageLabelBox({ image_file, w, x, y ,z })
{
  const [width_x, setWidthX] = useState(0.0);
  const [height_x, setWidthY] = useState(0.0);
  const [_x, setX] = useState(0.0);
  const [_y, setY] = useState(0.0);

  // const calculateImageBoundingBox = () => {
  //   xCenter = parseFloat();
  //   yCenter = parseFloat();

  //   xWidth = parseFloat();
  //   xHeight = parseFloat();

  //   __x = parseInt(xCenter - (xWidth/2));
  //   __y = parseInt(yCenter - (xHeight/2));

  //   setWidthX(width_x);
  //   setWidthY(height_x);
  //   setX(__x);
  //   setY(__y);
  // };

  // useEffect(() => { calculateImageBoundingBox() }, []);

  return (
    <Fragment>
      <div style={{ position: "relative" }}>
        <img className="img-fluid" alt="image View" src={image_file} />
        <div
          style={{
            top: '20px',
            left: '50px',
            width: '50px',
            height: '40px',
            backgroundColor: "#00000030",
            position: "absolute",
            border: "2px solid ",
          }}
        />
      </div>
    </Fragment>
  );
}
