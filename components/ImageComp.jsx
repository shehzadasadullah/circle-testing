import React, { useState } from "react";

const ImageComp = ({
  src,
  height,
  width,
  style,
  fallbackSrc,
  fallbackComp,
}) => {
  const [imgFallbackSrc, setImgFallbackSrc] = useState(false);
  return (
    <>
      {imgFallbackSrc && fallbackSrc.length == 0 ? (
        fallbackComp()
      ) : (
        <img
          src={
            src && !imgFallbackSrc
              ? src
              : fallbackSrc
              ? fallbackSrc
              : "noImageThumb.svg"
          }
          alt="User Image"
          height={height}
          width={width}
          style={style}
          loading="lazy"
          onError={(error) => {
            setImgFallbackSrc(true);
          }}
        />
      )}
    </>
  );
};

export default ImageComp;
