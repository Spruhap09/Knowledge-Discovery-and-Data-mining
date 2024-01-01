import { useEffect, useRef, useState } from "react";

// Custom Hook useCanvas
// Creates reference to Canvas element as well as Mouse location
// useRef let's us reference a value not needed for rendering
// Takes in a function onDraw used for drawing lines to canvas
// Takes in a string that is a hex value representing a color
export default function useCanvas(
  onDraw?: ({ context, currentPoint, prevPoint }: Draw) => void,
  color?: string
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);
  const [mouseDown, setMouseDown] = useState(false);


  const onMouseDown = () => setMouseDown(true);

  // Clears the canvas screen
  const clear = () => {
    // Get the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear all contents
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Fills canvas screen with current color
  const fill = () => {
    // Get the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !color) return;

    // Fill all contents with selected color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = (format = 'png') => {
    // Get the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save()

    
    // Fill all contents with selected color
    const link = document.createElement("a");

    if (format.toLowerCase() === 'jpeg') {
      link.download = "canvas.jpeg";
      link.href = canvas.toDataURL("image/jpeg");
    } else {
      link.download = "canvas.png";
      link.href = canvas.toDataURL("image/png");
    }

    // link.download = "canvas.png";
    // link.href = canvas.toDataURL();
    link.click();
  }


  useEffect(() => {
    // Mouse move event listeners
    const handler = (e: MouseEvent) => {
      if (!onDraw) return;
      if (!mouseDown) return;
      
      // Get the canvas context
      const currentPoint = computePointOnCanvas(e);
      const context = canvasRef.current?.getContext("2d");
      if (!context || !currentPoint ) return;

      onDraw({ context, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    // Returns current mouse point on canvas
    const computePointOnCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    // Stops drawing when mouse stops being clicked
    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    // Cleanup function run when component unmounts (prevents memory leaks)
    const cleanup = () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    return cleanup;
  }, [onDraw, mouseDown]);

  return { canvasRef, onMouseDown, clear, fill, download };
}
