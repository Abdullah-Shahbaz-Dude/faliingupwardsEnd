// import Image from "next/image";
// import { useState } from "react";
// import styles from "./ImageComponent.module.css";

// export default function ImageComponent({
//   src,
//   fallback,
//   alt,
//   isDecorative = false,
//   className = "",
//   sizes,
//   priority,
//   fill,
//   width,
//   height,
// }) {
//   const [imgSrc, setImgSrc] = useState(src);

//   return (
//     <Image
//       src={imgSrc}
//       alt={isDecorative ? "" : alt}
//       aria-hidden={isDecorative}
//       onError={() => setImgSrc(fallback)}
//       className={`${styles.image} ${className}`}
//       sizes={sizes}
//       priority={priority}
//       fill={fill}
//       width={width}
//       height={height}
//       loading={priority ? undefined : "lazy"}
//     />
//   );
// }
