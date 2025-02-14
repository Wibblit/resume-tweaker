"use client"

import React from "react";

interface Base64ImageProps {
  base64String: string;
  alt?: string;
  width?: number;
  height?: number;
}

const Base64Image: React.FC<Base64ImageProps> = ({
  base64String,
  alt = "Image",
  width,
  height,
}) => {
  return (
    <img
      src={base64String} // Use base64String as is
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: "cover" }}
    />
  );
};

export default Base64Image;