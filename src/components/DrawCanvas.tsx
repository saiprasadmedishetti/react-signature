import { useRef, MouseEvent, useState } from "react";
import useResizeObserver from "../hooks/useResizeObserver";

const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = 600;

export default function DrawCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDown, setIsTouchDown] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [penColor, setPenColor] = useState("#1e90ff");
  const [lastCordinates, setLastCordinates] = useState({
    x: 0,
    y: 0,
  });

 const {width} =  useResizeObserver();

 const getWidth = () => {
    const rootPadding = 24 * 2;
    return CANVAS_WIDTH + rootPadding < width ? CANVAS_WIDTH : width - rootPadding ;
 }

  const getContext = () => {
    return canvasRef.current!.getContext("2d") as CanvasRenderingContext2D;
  };

  const getPosition = (e: MouseEvent<HTMLCanvasElement>) => {
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;
    return { x, y };
  };
 
  const getTouchPos = (e : TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect() as DOMRect;
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const draw = (x: number, y: number) => {
    const ctx = getContext();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.strokeStyle = penColor;
    ctx.moveTo(lastCordinates.x, lastCordinates.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    const { x, y } = getPosition(e);
    setLastCordinates({
      x,
      y,
    });
  };

  const onTouchStart = (e:TouchEvent) => {
    setIsTouchDown(true);
    const {x, y} = getTouchPos(e);
    setLastCordinates({
      x,
      y,
    });
  };


  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown) return;
    if (!isDrawn) {
      setIsDrawn(true);
    }
    const { x, y } = getPosition(e);
    draw(x, y);
    setLastCordinates({
      x,
      y,
    });
  };

  const onTouchMove = (e:TouchEvent) => {
    if (!isTouchDown) return;
    if (!isDrawn) {
      setIsDrawn(true);
    }
    const {x , y} = getTouchPos(e);
    draw(x, y);
    setLastCordinates({
      x,
      y,
    });
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
    setIsTouchDown(false);
  };
  const onMouseLeave = () => {
    setIsMouseDown(false);
    setIsTouchDown(false);
  };
  const clearCanvas = () => {
    const ctx = getContext();
    const { height, width } = canvasRef.current!;
    ctx.clearRect(0, 0, width, height);
    setIsDrawn(false);
    setLastCordinates({
      x: 0,
      y: 0,
    });
  };

  const saveCanvas = () => {
    if (lastCordinates.x < 3 || lastCordinates.y < 3) {
      alert("Please draw!");
    } else {
      const link = document.createElement("a");
      link.href = canvasRef.current?.toDataURL?.() as string;
      link.download = `draw-${Date.now()}.png`;
      link.click();
      link.remove();
    }
  };
  return (
    <>
      <h1 className="title">Signature App</h1>
      <canvas
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseUp={onMouseUp}
        onTouchEnd={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="bg-slate"
        height={CANVAS_HEIGHT}
        width={getWidth()}
        ref={canvasRef}
      />
      <div className="btn-group">
        <button disabled={!isDrawn} onClick={saveCanvas}>
          Save
        </button>
        <div className="color-picker">
          <span>Color</span>
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
          />
        </div>
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </>
  );
}
