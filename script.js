const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let image = "";
let shape = "original";
let append = "";
let who = "attendee";
var banner;

// Function to get URL parameters
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("speaker")) {
    who = "speaker";
  } else if (params.has("team")) {
    who = "team";
  } else {
    who = "attendee";
  }
};

// Call function to get URL parameters
getUrlParams();

const uploadImage = () => {
  document.querySelector("input.profile-input").click();
};

const changeShape = (type) => {
  const original = document.querySelector(".select-container .select#original");
  const square = document.querySelector(".select-container .select#square");
  shape = type;
  switch (type) {
    case "original": {
      append = "";
      original.setAttribute("selected", "");
      square.removeAttribute("selected");
      break;
    }
    case "square": {
      append = "";
      square.setAttribute("selected", "");
      original.removeAttribute("selected");
      break;
    }
  }
  draw();
};

const upload = (e) => {
  if (e && e.target.files && e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        image = img;
        draw();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
};

const draw = () => {
  banner = new Image();
  banner.src = "./" + who + append + ".png";
  banner.onload = () => {
    if (image) {
      switch (shape) {
        case "original": {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          break;
        }
        default: {
          const size = Math.min(image.width, image.height);
          canvas.width = 500;
          canvas.height = 500;
          const hRatio = canvas.width / image.width;
          const vRatio = canvas.height / image.height;
          const ratio = Math.max(hRatio, vRatio);
          const x = (canvas.width - image.width * ratio) / 2;
          const y = (canvas.height - image.height * ratio) / 2;
          ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            x,
            y,
            image.width * ratio,
            image.height * ratio
          );
          break;
        }
      }
    } else {
      ctx.canvas.width = 540;
      ctx.canvas.height = 540;
      ctx.fillStyle = "#0d47a1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const height = (banner.height / banner.width) * canvas.width;
    const y = canvas.height - height;
    const fontSize = canvas.width / 17.2;
    const fontY = y + height * 0.7;
    ctx.drawImage(
      banner,
      0,
      0,
      banner.width,
      banner.height,
      0,
      y,
      canvas.width,
      height
    );

    ctx.fillStyle = "#757575";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px Google Sans, sans-serif`;

    if (shape === "circle") {
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
    }
  };
};

const download = () => {
  const a = document.createElement("a");
  const url = canvas.toDataURL("image/png");
  a.download = "cloud@devfest-24-badge.png";
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

draw();
