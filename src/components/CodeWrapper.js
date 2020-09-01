import React from 'react'
import { useParams } from "react-router-dom";

function CodeWrapper() {
  const { roomID } = useParams();

  return(
    <div className="code-wrapper">
      {`Code: ${roomID}`}
    </div>
  )
}

export default CodeWrapper