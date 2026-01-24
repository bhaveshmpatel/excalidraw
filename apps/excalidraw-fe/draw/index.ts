export default function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const resizeCanvas = () => {
    // Set the internal resolution to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Re-apply context settings because resizing clears the canvas state
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  };

  // Initial resize
  resizeCanvas();

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("pointerdown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  canvas.addEventListener("pointerup", (e) => {
    clicked = false;
    console.log(e.clientX);
    console.log(e.clientY);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}
