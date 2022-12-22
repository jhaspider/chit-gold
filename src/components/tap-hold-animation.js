import Utils from "../utils/utils";

function TapHoldAnimation(props) {
  const { left, top } = props;
  const dimension = 50;
  let factor = 0;

  const addDom = () => {
    const canvas = Utils.newElem("canvas", null, "circular-anim");
    canvas.setAttribute("width", dimension);
    canvas.setAttribute("height", dimension);
    canvas.style.left = left - dimension / 2;
    canvas.style.top = top - dimension / 2;

    return canvas;
  };

  const draw = () => {
    if (factor >= 2 && intervalRef) clearInterval(intervalRef);

    var ctx = animation.getContext("2d");

    // line drawing

    ctx.beginPath();

    factor += 0.025;

    ctx.arc(dimension / 2, dimension / 2, (dimension - 10) / 2, 0, factor * Math.PI);

    if (factor >= 2) {
      ctx.fillStyle = "#00946a";
      ctx.fill();
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#003300";
    ctx.lineCap = "round";
    ctx.lineJoin = "bevel";
    ctx.stroke();
  };

  const stop = () => {
    if (intervalRef) clearInterval(intervalRef);
  };

  const animation = addDom();

  const intervalRef = setInterval(draw, 5);

  return {
    dom: animation,
    stop,
  };
}

export default TapHoldAnimation;
