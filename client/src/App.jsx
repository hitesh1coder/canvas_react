import { TbRectangle } from "react-icons/tb";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";

export default function App() {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ffffff");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [allData, setAllData] = useState([]);

  const strokeColor = "#000";
  const isPainting = useRef();
  const currentShapeId = useRef();
  const transformerRef = useRef();

  const isDraggable = action === ACTIONS.SELECT;

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
          },
        ]);
        break;

      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
          },
        ]);
        break;
      case ACTIONS.TEXT:
        const newText = {
          id,
          x,
          y,
          text: "",
          fontSize: 20,
          fontFamily: "Arial",
          fill: fillColor,
        };
        setText((text) => [...text, newText]);
        break;
    }
  }
  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  }

  function onPointerUp() {
    isPainting.current = false;
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  function handleSave() {
    if (
      rectangles.length > 0 ||
      circles.length > 0 ||
      arrows.length > 0 ||
      scribbles.length > 0
    ) {
      setAllData({
        rectangles,
        circles,
        arrows,
        scribbles,
      });
    } else {
      alert("Please draw something first");
    }
  }

  const handleExportPage = async () => {
    if (allData.length === 0) {
      alert("Please save the data first");
    } else {
      try {
        const res = await axios.post("http://localhost:5500/api/add", allData);
        if (res.status === 201) {
          alert(res.data?.message);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Controls */}
        <div className="z-10 w-full py-2 bg-gray-200">
          <button
            onClick={handleExportPage}
            className=" mx-40 p-2 rounded-lg bg-green-600 text-white font-semibold text-right"
          >
            Export
          </button>
          <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg bg-white">
            <button
              className={
                action === ACTIONS.SELECT
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <GiArrowCursor size={"2rem"} />
            </button>

            <button
              className={
                action === ACTIONS.RECTANGLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.RECTANGLE)}
            >
              <TbRectangle size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.CIRCLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.CIRCLE)}
            >
              <FaRegCircle size={"1.5rem"} />
            </button>
            <button
              className={
                action === ACTIONS.ARROW
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.ARROW)}
            >
              <FaLongArrowAltRight size={"2rem"} />
            </button>
            <button
              className={
                action === ACTIONS.SCRIBBLE
                  ? "bg-violet-300 p-1 rounded"
                  : "p-1 hover:bg-violet-100 rounded"
              }
              onClick={() => setAction(ACTIONS.SCRIBBLE)}
            >
              <LuPencil size={"1.5rem"} />
            </button>

            <button>
              <input
                className="w-6 h-6"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </button>

            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-blue-600 text-white font-semibold text-right"
            >
              save
            </button>
          </div>
        </div>
        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => {
                transformerRef.current.nodes([]);
              }}
            />

            {rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            {circles.map((circle) => (
              <Circle
                key={circle.id}
                radius={circle.radius}
                x={circle.x}
                y={circle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={circle.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                lineCap="round"
                lineJoin="round"
                points={scribble.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={scribble.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
