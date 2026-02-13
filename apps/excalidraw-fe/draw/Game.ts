import { Tool } from "@/app/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: "number";
      startY: "number";
      endX: "number";
      endY: "number";
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool = "circle";
  socket: WebSocket;
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.mouseDownHandler);
    this.canvas.removeEventListener("pointerup", this.mouseUpHandler);
    this.canvas.removeEventListener("pointermove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.onWheel);
  }

  setZoom(scale: number) {
    // Zoom around center
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const worldCenter = {
      x: (centerX - this.offsetX) / this.scale,
      y: (centerY - this.offsetY) / this.scale,
    };

    this.scale = scale;
    this.offsetX = centerX - worldCenter.x * this.scale;
    this.offsetY = centerY - worldCenter.y * this.scale;

    this.clearCanvas();
  }

  onWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom Logic
      const zoomIntensity = 0.1;
      const wheel = e.deltaY < 0 ? 1 : -1;
      const zoom = Math.exp(wheel * zoomIntensity);

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const worldMouse = {
        x: (mouseX - this.offsetX) / this.scale,
        y: (mouseY - this.offsetY) / this.scale,
      };

      const newScale = this.scale * zoom;
      this.scale = newScale;
      this.offsetX = mouseX - worldMouse.x * this.scale;
      this.offsetY = mouseY - worldMouse.y * this.scale;
    } else {
      // Pan Logic
      this.offsetX -= e.deltaX;
      this.offsetY -= e.deltaY;
    }

    this.clearCanvas();
  };

  setTool(tool: "circle" | "pencil" | "rect" | "text" | "arrow" | "eraser") {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  mouseDownHandler = (e: PointerEvent) => {
    this.clicked = true;
    this.startX = (e.clientX - this.offsetX) / this.scale;
    this.startY = (e.clientY - this.offsetY) / this.scale;
  };
  mouseUpHandler = (e: PointerEvent) => {
    this.clicked = false;
    const width = (e.clientX - this.offsetX) / this.scale - this.startX;
    const height = (e.clientY - this.offsetY) / this.scale - this.startY;

    //@ts-ignore
    const selectedTool = this.selectedTool;

    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        // @ts-ignore
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius,
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
      };
    }
    if (!shape) {
      return;
    }
    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      }),
    );
  };
  mouseMoveHandler = (e: PointerEvent) => {
    if (this.clicked) {
      const width = (e.clientX - this.offsetX) / this.scale - this.startX;
      const height = (e.clientY - this.offsetY) / this.scale - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = "white";

      let selectedTool = this.selectedTool;
      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("pointerdown", this.mouseDownHandler);
    this.canvas.addEventListener("pointerup", this.mouseUpHandler);
    this.canvas.addEventListener("pointermove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
  }
}
