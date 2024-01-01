import useCanvas from "@/hooks/useCanvas";
import ClearScreen from "@/components/tools/ClearScreen";
import PaintBucket from "@/components/tools/PaintBucket";
import PaintBrush from "@/components/tools/PaintBrush";
import DownloadImage from "@/components/tools/DownloadImage";
import { useCallback, useState, useEffect} from "react";
import ColorBoardProps from "./tools/ColorBoard";

export default function Canvas() {
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  //colors the canvas background white as default
  useEffect(() => {
    const canvas:any = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set white background
    context.fillStyle = '#fff'; // White color
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [])


  // drawLine function, gets passed in as callback to useCanvas hook
  const drawLine = useCallback(
    ({ prevPoint, currentPoint, context }: Draw) => {
      const { x: currX, y: currY } = currentPoint;
      const lineColor = color;
      let startPoint = prevPoint ?? currentPoint;
      context.beginPath();
      context.lineWidth = lineWidth;
      context.strokeStyle = lineColor;
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(currX, currY);
      context.stroke();

      context.fillStyle = lineColor;
      context.beginPath();
      context.arc(startPoint.x, startPoint.y, Math.floor(lineWidth/2), 0, 2 * Math.PI);
      context.fill();
    },
    [color, lineWidth]
  );

  const { canvasRef, onMouseDown, clear, fill, download } = useCanvas(drawLine, color);

  return (
    <div className="w-full h-full m-5 flex justify-center items-center">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        id="canvas"
        className="border-4 border-blue-gray-800 rounded-3xl"
      ></canvas>
      <div className="w-15 h-1/2 m-2 flex flex-col justify-center items-center rounded-full border-4 border-blue-gray-800 ">

        <ColorBoardProps color={color} setColor={setColor}/>
        <ClearScreen onClick={clear} />
        <PaintBrush value={lineWidth} setValue={setLineWidth} />
        <PaintBucket onClick={fill} />
        <DownloadImage onClick={() => setShowDownloadModal(true)} />
        {showDownloadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold mb-4 text-center">Select a format</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => { download('jpeg'); setShowDownloadModal(false); }}>
                JPEG
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => { download('png'); setShowDownloadModal(false); }}>
                PNG
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setShowDownloadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
