// https://vike.dev/Head

import React from "react";
import logoUrl from "../assets/logo.svg";
console.log(logoUrl);
export default function HeadDefault() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
    </>
  );
}
