import { useState, useEffect } from "react";

function Mascot({ mood }) {
  const faces = {
    happy: "(◕‿◕)",
    neutral: "(•_•)",
    sad: "(╥﹏╥)"
  };

  return (
    <div className="flex flex-col items-center mt-3">
      <div className="text-5xl">{faces
