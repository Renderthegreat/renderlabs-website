export function wut(canvas) {
  let TouchingWindowBar = false;
  let StartDrag = {};
  let Callbacks = {};
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio * 1;
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;
  let lines = [];
  let lineIndex = 0;
  const lineHeight = 20;
  const lineMax = canvas.height / lineHeight - 10 * scale;
  ctx.scale(scale, scale);
  function resetCtx() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    if (WUT) ctx.fillStyle = WUT.Theme.Background;

    if (WUT && WUT.Theme && WUT.Theme.Background.src) {
      ctx.drawImage(WUT.Theme.Background, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  resetCtx();
  function log(text, color) {
    lineIndex++;
    if (text != null) {
      lines.push({ text, color });
    }
    if (text == "clear") {
      lines = [];
    }
    if (lines.length > lineMax) {
      lines.shift();
      lineIndex--;
    }

    resetCtx();
    ctx.font = "10px Arial";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = lines[i].color;
      ctx.fillText(lines[i].text, 0, lineHeight + i * 10);
    }
  }
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("keydown", function (event) {
    WUT.Keyboard.Down[event.code.toLowerCase()] = true;
  });
  document.addEventListener("keyup", function (event) {
    WUT.Keyboard.Down[event.code.toLowerCase()] = false;
  });
  function handleMouseMove(event) {
    let rect = canvas.getBoundingClientRect();
    Mouse.x = event.clientX - rect.left;
    Mouse.y = event.clientY - rect.top;
    //console.log(`[info]: Mouse moved to ${Mouse.x}, ${Mouse.y}`, "white");
  }

  function handleMouseDown(event) {
    Mouse.Down = true;
    //console.log("[info]: Mouse down", "white");
  }

  function handleMouseUp(event) {
    Mouse.Down = false;
    TouchingWindowBar = false;
  }

  function handleTouchMove(event) {
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    Mouse.x = event.touches[0].clientX - rect.left;
    Mouse.y = event.touches[0].clientY - rect.top;
    Mouse.Drag = true;
    //console.log(`[info]: Touch moved to ${Mouse.x}, ${Mouse.y}`, "white");
  }

  function handleTouchStart(event) {
    event.preventDefault();
    Mouse.Down = true;
    let rect = canvas.getBoundingClientRect();
    Mouse.x = event.touches[0].clientX - rect.left;
    Mouse.y = event.touches[0].clientY - rect.top;
    //log(`[info]: Touch started at ${Mouse.x}, ${Mouse.y}`, "white");
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    Mouse.Down = false;
    Mouse.Drag = false;
    Mouse.Used = false;
    TouchingWindowBar = false;
    //log("[info]: Touch ended", "white");
  }
  function Sort(array) {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i].Rank < array[i + 1].Rank) {
          let temp = array[i];
          array[i] = array[i + 1];
          array[i + 1] = temp;
          sorted = false;
        }
      }
    }
    return array;
  }
  function BackgroundCover(src) {
    let img = new Image();
    img.src = src;
    return img;
  }
  log("[info]: Creating new WUT instance", "white");
  class Window {
    constructor(n, d, f, b) {
      let Name = n;
      let Binding = b;
      let Dimensions = d;
      let Bar = {};
      let Buttons = {};
      Buttons.FullScreen = {};
      Buttons.Close = {};
      if (f) {
        Dimensions = [0, 0, 100, 100];
      }
      Bar.x = Dimensions[0];
      Bar.y = Dimensions[1] - 20;
      Bar.fx = Dimensions[0] + Dimensions[2];
      Bar.fy = Dimensions[1];
      Bar.name = Name;
      Buttons.FullScreen.x = Dimensions[0] + Dimensions[2] - 10;
      Buttons.FullScreen.y = Dimensions[1] + Dimensions[3] + 10;
      Buttons.FullScreen.fx = 20;
      Buttons.FullScreen.fy = -20;
      Buttons.Close.x = Dimensions[0] + Dimensions[2];
      Buttons.Close.y = Dimensions[1];
      Buttons.Close.fx = 20;
      Buttons.Close.fy = -20;
      this.Bar = Bar;
      this.Buttons = Buttons;
      this.Binding = Binding;
      this.Sizes = Dimensions;
      this.Origin = Dimensions;
      this.dim = [
        this.Sizes[0],
        this.Sizes[1],
        this.Sizes[0] + this.Sizes[2],
        this.Sizes[3],
      ];
      this.newProxy();
      this.GUI = f;
      this.Window.Resize = this.Resize;
      this.Window.Move = this.Move;
      this.Move(0, 0);
    }
    newProxy = () => {
      let dim = this.dim;
      this.proxy = new Proxy(this.dim, {
        get: function (target, prop, receiver) {
          if (prop == "x") {
            return dim[0];
          }
          if (prop == "y") {
            return dim[1];
          }
          if (prop == "fx") {
            return dim[2];
          }
          if (prop == "fy") {
            return dim[3];
          }
          return false;
        },
        set: function (target, prop, value) {
          if (prop == "x") {
            target[0] = value;
          }
          if (prop == "y") {
            target[1] = value;
          }
          if (prop == "fx") {
            target[0] = value - target[2];
          }
          if (prop == "fy") {
            target[1] = value - target[3];
          }
          return true;
        },
      });
    };
    Display() {
      if (!this.GUI) {
        let Dimensions = this.Sizes;
        if (!WUT) return -1;
        ctx.fillStyle = WUT.Theme.Bar == "default" ? "grey" : WUT.Theme.Bar;
        ctx.fillRect(this.Bar.x, this.Bar.y, this.Bar.fx, 20);
        ctx.fillStyle = WUT.Theme.Text == "default" ? "white" : WUT.Theme.Text;
        ctx.fillText(this.Bar.name, this.Bar.x + 5, this.Bar.y + 12.5);
        ctx.fillStyle =
          WUT.Theme.Resize == "default" ? "lightgrey" : WUT.Theme.Resize;
        ctx.fillRect(
          this.Buttons.FullScreen.x,
          this.Buttons.FullScreen.y,
          this.Buttons.FullScreen.fx,
          this.Buttons.FullScreen.fy,
        );
        ctx.fillStyle = WUT.Theme.Close == "default" ? "red" : WUT.Theme.Close;
        ctx.fillRect(
          this.Buttons.Close.x,
          this.Buttons.Close.y,
          this.Buttons.Close.fx,
          this.Buttons.Close.fy,
        );
        ctx.fillStyle = WUT.Theme.Text == "default" ? "white" : WUT.Theme.Text;
        ctx.fillText("X", this.Buttons.Close.x + 6.5, this.Buttons.Close.y - 6);

        this.Index++;
        this.Window.Bar = this.Bar;
        this.Window.x = this.Bar.x;
        this.Window.y = this.Bar.y;
        this.Window.fx = this.Bar.fx;
        this.Window.fy = this.Bar.fy;
        this.Window.Mouse.x = Mouse.x - this.Bar.x;
        this.Window.Mouse.y = Mouse.y - this.Bar.y;
        this.Window.Rank = this.Rank;
        if (
          this.Window.Mouse.x > 0 &&
          this.Window.Mouse.x < this.Window.Bar.fx &&
          this.Window.Mouse.y > 0 &&
          this.Window.Bar.fy > this.Window.Mouse.y
        ) {
          this.Window.Mouse.Focus = true;
          this.Window.Mouse.Down = Mouse.Down;
        } else {
          this.Window.Mouse.Focus = false;
          this.Window.Mouse.Down = false;
        }
      }
      let res = this.Binding(ctx, this.proxy, {
        ...this.Window,
        Resize: this.Resize,
        Move: this.Move,
      });
      if (res && !Callbacks.disp) {
        if (res.mx) {
          this.mx = res.mx;
        }
        if (res.my) {
          this.my = res.my;
        }
        Callbacks.disp = true;
        this.Resize(0, 0);
      }
    }
    Move(x, y) {
      this.Sizes = [this.dim[0] + x, this.dim[1] + y, this.dim[2], this.dim[3]];
      let Dimensions = this.Sizes;
      Dimensions[0] = Dimensions[0] < 0 ? 0 : Dimensions[0];
      Dimensions[1] = Dimensions[1] < 20 ? 20 : Dimensions[1];
      Dimensions[0] =
        Dimensions[0] + Dimensions[2] >= canvas.width
          ? canvas.width - Dimensions[2]
          : Dimensions[0];
      Dimensions[1] =
        Dimensions[1] + Dimensions[3] >= canvas.height
          ? canvas.height - Dimensions[3]
          : Dimensions[1];
      this.Bar.x = Dimensions[0];
      this.Bar.y = Dimensions[1] - 20;
      this.Bar.fx = this.dim[2];
      this.Bar.fy = this.dim[3];
      this.Buttons.FullScreen.x = Dimensions[0] + Dimensions[2] - 10;
      this.Buttons.FullScreen.y = Dimensions[1] + Dimensions[3] + 10;
      this.Buttons.FullScreen.fx = 20;
      this.Buttons.FullScreen.fy = -20;
      this.Buttons.Close.x = Dimensions[0] + Dimensions[2];
      this.Buttons.Close.y = Dimensions[1];
      this.Buttons.Close.fx = 20;
      this.Buttons.Close.fy = -20;
      this.dim = this.Sizes;
      this.newProxy();
      this.Display();
    }
    Resize(x, y) {
      this.Sizes = [this.dim[0] + x, this.dim[1] + y, this.dim[2], this.dim[3]];
      let Dimensions = this.Sizes;
      this.Bar.fx = Dimensions[0] + Dimensions[2];
      this.Bar.fy = Dimensions[1] - 20 + Dimensions[3];
      //this.dim = [...this.Sizes]
      this.dim[3] += this.Sizes[1];
      this.dim[2] += this.Sizes[0];
      this.dim[2] = Math.max(this.dim[2], this.mx || 40);
      this.dim[3] = Math.max(this.dim[3], this.my || 40);
      this.Buttons.FullScreen.x = Dimensions[0] + Dimensions[2] - 10;
      this.Buttons.FullScreen.y = Dimensions[1] + Dimensions[3] + 10;
      this.Buttons.FullScreen.fx = 20;
      this.Buttons.FullScreen.fy = -20;
      this.Buttons.Close.x = Dimensions[0] + Dimensions[2];
      this.Buttons.Close.y = Dimensions[1];
      this.Buttons.Close.fx = 0;
      this.Buttons.Close.fy = -20;
      this.newProxy();
      this.Move(0, 0);
      this.Display();
    }
    Index = 0;
    Window = {
      Size: { ...this.dim },
      x: 0,
      y: 0,
      Rank: 0,
      Mouse: {
        x: 0,
        y: 0,
        Down: false,
        Focus: false,
      },
      Dropdown: function (x, y, fx, fy, items, cbs) {
        ctx.fillRect(this.x + x, this.y + y, fx, fy);

        if (
          !WUT.Mouse.Used &&
          !WUT.Mouse.Drag &&
          this.Mouse.x > x &&
          this.Mouse.x < x + fx &&
          this.Mouse.y > y &&
          this.Mouse.y < y + fy
        ) {
          for (let i = 0; i < items.length; i++) {
            ctx.fillStyle = this.Accents[i][0];
            ctx.fillRect(this.x + x, this.y + y + (i + 1) * 20, fx, 20);
            ctx.fillStyle = this.Accents[i][1];
            ctx.fillText(
              items[i],
              this.x + x + 5,
              this.y + y + (i + 1) * 20 + 10,
            );
            setTimeout(() => {
              if (
                !WUT.Mouse.Used &&
                WUT.Mouse.Down &&
                this.Mouse.x > x &&
                this.Mouse.x < x + fx &&
                this.Mouse.y > y + (i + 1) * 20 &&
                this.Mouse.y < y + (i + 1) * 20 + 20
              ) {
                cbs[i]();
                WUT.Mouse.Used = true;
              }
            }, 100);
          }
        }
      },
      Tooltip: function (x, y, fx, fy, text) {
        ctx.fillRect(this.x + x, this.y + y, fx, fy);
        ctx.fillStyle = this.Accents[0];
        ctx.fillText("?", this.x + x + 5, this.y + y + 14);
        if (
          this.Mouse.x > x &&
          this.Mouse.x < x + fx &&
          this.Mouse.y > y &&
          this.Mouse.y < y + fy
        ) {
          ctx.fillStyle = this.Accents[1];
          ctx.fillRect(this.x + x, this.y + y + 20, fx, fy);
          ctx.fillStyle = this.Accents[0];
          ctx.fillText(text, this.x + x + 20, this.y + y + 14);
        }
      },
      Button: function (x, y, fx, fy, cb) {
        ctx.fillStyle = this.Accents[0];
        ctx.fillRect(this.x + x, this.y + y, fx, fy);
        if (
          this.Mouse.Focus &&
          this.Mouse.x > x &&
          this.Mouse.x < x + fx &&
          this.Mouse.y > y &&
          this.Mouse.y < y + fy
        ) {
          if (this.Mouse.Down && !WUT.Mouse.Used) {
            if (cb) {
              cb();
            }
            WUT.Mouse.Used = true;
          }
        } else {
        }
      },
      UnorderedList: function (x, y, items, spacing, id) {
        for (let i = 0; i < items.length; i++) {
          this.i = i;
          ctx.fillStyle = this.Accents[i][0];
          if (typeof items[i] == "string") {
            ctx.fillText(items[i], this.x + x + 5, this.y + y + i * spacing);
          } else if (typeof items[i] == "object") {
            let t = 0;
            if (!this.Checkboxes[id]) this.Checkboxes[id] = [];
            for (let j = 0; j < items[i].length; j++) {
              ctx.fillStyle = this.Accents[i][j];
              if (items[i][j] == "Checkbox") {
                this.j = j;
                this.Checkboxes[id][i] = this.Checkbox(
                  x + 5 + t,
                  y + (i - 0.6) * spacing,
                  spacing - 1,
                  spacing - 1,
                  this.Checkboxes[id][i],
                );
                t += spacing;
              } else if (typeof items[i][j] == "string") {
                ctx.fillText(
                  items[i][j],
                  this.x + x + 5 + t,
                  this.y + y + i * spacing,
                );
                t += ctx.measureText(items[i][j].data).width + 5;
              }
              this.j = 0;
            }
          }
          this.i = 0;
        }
        return this.Checkboxes[id];
      },
      OrderedList: function (x, y, items, spacing, id) {
        items = items.sort();
        for (let i = 0; i < items.length; i++) {
          this.i = i;
          ctx.fillStyle = this.Accents[i][0];
          if (typeof items[i] == "string") {
            ctx.fillText(items[i], this.x + x + 5, this.y + y + i * spacing);
          } else if (typeof items[i] == "object") {
            let t = 0;
            if (!this.Checkboxes[id]) this.Checkboxes[id] = [];
            for (let j = 0; j < items[i].length; j++) {
              ctx.fillStyle = this.Accents[i][j];
              if (items[i][j] == "Checkbox") {
                this.j = j;
                this.Checkboxes[id][i] = this.Checkbox(
                  x + 5 + t,
                  y + (i - 0.6) * spacing,
                  spacing - 1,
                  spacing - 1,
                  this.Checkboxes[id][i],
                );
                t += spacing;
              } else if (typeof items[i][j] == "string") {
                ctx.fillText(
                  items[i][j],
                  this.x + x + 5 + t,
                  this.y + y + i * spacing,
                );
                t += ctx.measureText(items[i][j].data).width + 5;
              }
              this.j = 0;
            }
          }
          this.i = 0;
        }
        return this.Checkboxes[id];
      },
      Checkboxes: {},
      Checkbox: function (x, y, fx, fy, assigned, cb) {
        ctx.fillStyle = this.Accents[this.i][this.j][0];
        ctx.fillRect(this.x + x, this.y + y, fx, fy);
        if (
          this.Mouse.Focus &&
          this.Mouse.x > x &&
          this.Mouse.x < x + fx &&
          this.Mouse.y > y &&
          this.Mouse.y < y + fy
        ) {
          if (this.Mouse.Down && !WUT.Mouse.Used) {
            assigned = !assigned;
            if (cb) {
              cb(assigned);
            }
            WUT.Mouse.Used = true;
          }
        } else {
        }
        if (assigned) {
          ctx.fillStyle = this.Accents[this.i][this.j][1];
          ctx.fillRect(this.x + x + 2, this.y + y + 2, fx - 4, fy - 4);
        }

        return assigned;
      },
      Rect: function (x, y, fx, fy) {
        ctx.fillStyle = this.Accents[0];
        ctx.fillRect(this.x + x, this.y + y, fx, fy);
      },
      Ellipse: function (x, y, fx, fy) {
        ctx.fillStyle = this.Accents[0];
        ctx.beginPath();
        ctx.ellipse(
          this.x + x + fx / 2,
          this.y + y + fy / 2,
          fx / 2,
          fy / 2,
          0,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      },
      Accents: [],
      i: 0,
      j: 0,
      useAccent: function (a) {
        this.Accents = a;
      },
    };

    Rank = 0;
  }

  function BackgroundCover(src) {
    let img = new Image();
    img.src = src;
    return img;
  }
  var Mouse = {
    x: 0,
    y: 0,
    Down: false,
    Drag: false,
    Used: false,
  };
  let Init = function () {
    setInterval(() => {
      WUT.Initalized = true;
      for (let i in WUT.Windows) {
        if (!WUT.Windows[i]) continue;
        if (Mouse.Down && !Mouse.Drag) StartDrag = { x: Mouse.x, y: Mouse.y };
        else {
          StartDrag = { x: null, y: null };
        }
        if (WUT.Windows[i].GUI) break;
        if ((Mouse.Down && !Mouse.Drag) || TouchingWindowBar) {
          if (
            !TouchingWindowBar &&
            Mouse.x > WUT.Windows[i].Buttons.Close.x - 20 &&
            Mouse.x < WUT.Windows[i].Buttons.Close.x + 20 &&
            Mouse.y > WUT.Windows[i].Buttons.Close.y - 20 &&
            Mouse.y < WUT.Windows[i].Buttons.Close.y + 0
          ) {
            delete WUT.Windows[i];
          } else if (
            TouchingWindowBar == 300 + i + 1 ||
            (Mouse.x > WUT.Windows[i].Buttons.FullScreen.x - 20 &&
              Mouse.x < WUT.Windows[i].Buttons.FullScreen.x + 20 &&
              Mouse.y > WUT.Windows[i].Buttons.FullScreen.y - 20 &&
              Mouse.y < WUT.Windows[i].Buttons.FullScreen.y + 20)
          ) {
            let newX =
              Mouse.x -
              WUT.Windows[i].Bar.x -
              WUT.Windows[i].Buttons.FullScreen.x;
            let newY =
              Mouse.y -
              WUT.Windows[i].Bar.y -
              WUT.Windows[i].Buttons.FullScreen.y;
            WUT.Windows[i].Resize(newX, newY);
            TouchingWindowBar = 300 + i + 1;
          } else if (
            (StartDrag && TouchingWindowBar == i + 1) ||
            (!TouchingWindowBar &&
              Mouse.x > WUT.Windows[i].Bar.x &&
              Mouse.x < WUT.Windows[i].Bar.x + WUT.Windows[i].Bar.fx &&
              Mouse.y > WUT.Windows[i].Bar.y &&
              Mouse.y < WUT.Windows[i].Bar.y + 20)
          ) {
            let newX =
              WUT.Windows[i].Window.Mouse.x - WUT.Windows[i].Bar.fx / 2;
            let newY = Mouse.y - WUT.Windows[i].Bar.y;
            WUT.Windows[i].Move(newX, newY);
            WUT.Windows.forEach((e) => e.Rank--);
            WUT.Windows[i].Rank = 0;

            WUT.Windows.sort((a, b) => b.Rank - a.Rank);
            TouchingWindowBar = 1;
          }
        }
      }
      for (let i in WUT.Conditions) {
        if (WUT.Conditions[i]()) {
          WUT.Conditions[i]();
        }
      }
    }, 1000 / WUT.TPS);
    setInterval(() => {
      WUT.log(null, "white");
      for (let i = WUT.Windows.length - 1; i >= 0; i--) {
        if (!WUT.Windows[i]) continue;
        WUT.Windows[i].Display();
      }
    }, 1000 / WUT.FPS);
  };
  var WUT = {
    Window,
    Windows: [],
    Create: function (f) {
      WUT.Windows.push(f());
    },
    FPS: 80,
    TPS: 80,
    Conditions: [
      () => {
        if (WUT.Windows.length == 0) {
          WUT.Windows.push(WUT.Presets.Welcome);
        }
      },
    ],
    Init,
    Presets: {
      Welcome: (() => {
        let Page = 0;
        let Checkboxes = [false, true];
        let Ids = {
          One: 0,
          Two: 1,
        };
        return new Window(
          "Welcome",
          [40, 40, 100, 100],
          false,
          (cmx, d, window) => {
            cmx.fillStyle = "royalblue";
            let Text = [];
            let wx = d.x;
            let wy = d.y;
            let wfx = d.fx;
            let wfy = d.fy;
            window.useAccent([
              [["green", "blue"], "blue"],
              [["blue", "red"], "red"],
              [["red", "green"], "green"],
            ]);
            cmx.fillRect(wx, wy, wfx, wfy);
            cmx.fillStyle = "white";
            if (Page == 0) {
              Text.push(
                "Welcome to the Window UI Toolkit (WUT).",
                "Press (+) to learn more.",
              );
              window.UnorderedList(
                20,
                200,
                [
                  ["Checkbox", "hello"],
                  ["Checkbox", "hello"],
                  ["Checkbox", "hello"],
                ],
                20,
                Ids.Two,
              );
            }
            if (Page == 1) {
              Text.push(
                "WUT is a toolbox for creating and managing windows.",
                "WUT is 100% Open Source and free to use.",
                "Tired of creating window displays manually?",
                "WUT is here to help you.",
                "Lets start by creating a window.",
                "To create a window, use the function",
                "new Window",
                "(name, [x, y, width, height], isNotResizable, callback).",
                "The code inside of the callback will be ran every frame.",
                "This means that you will want to create a function to",
                "define variables that will not reset.",
                "",
              );
            }

            Text.forEach((line, index) => {
              cmx.fillText(line, wx + 5, wy + 20 + index * lineHeight);
            });
            window.useAccent([Page !== 0 ? "yellow" : "darkorange"]);
            window.Button(20, wfy - 10, 20, 20, () => {
              if (Page != 0) Page--;
            });
            window.useAccent([Page !== 8 ? "yellow" : "darkorange"]);
            window.Button(80, wfy - 10, 20, 20, () => {
              if (Page != 8) Page++;
            });
            cmx.fillStyle = "black";
            cmx.fillText("-", wx + 28, wy + wfy - 16);
            cmx.fillText("+", wx + 87, wy + wfy - 16);
            cmx.fillStyle = "white";
            //window.Dropdown(20, 20, 60, 30, ["Welcome", "Hello"], [() => { WUT.log("welcome") }, () => { WUT.log("hello") }])
            //window.Tooltip(80, 80, 80, 80, "Dropdown")
            //window.UnorderedList(20, 100, [["Checkbox", "hello"], ["Checkbox", "Hello"], ["Checkbox", "hello"],], 20, Ids.One)

            //
            //Checkboxes[0] = window.Checkbox(5, 50, 30, 30, Checkboxes[0], () => { WUT.log("checkbox") })
            return {
              mx: 250,
              my: 350,
            };
          },
        );
      })(),
    },
    Kill: function (pid) {
      delete WUT.Window[pid] + 1;
    },
    log: log,
    Initalized: false,
    Mouse,
    Keyboard: {
      Down: [],
    },
    Theme: {
      Text: "default",
      Bar: "default",
      Close: "default",
      Resize: "default",
      Checkbox: "default",
      Background: "default",
      Presets: {
        default: {
          Text: "white",
          Bar: "grey",
          Close: "red",
          Resize: "lightgrey",
          Background: "black",
        },
        dark: {
          Text: "white",
          Bar: "indigo",
          Close: "red",
          Resize: "white",
          Background: "black",
        },
        light: {
          Text: "black",
          Bar: "white",
          Close: "red",
          Resize: "white",
          Background: "lightblue",
        },
        united: {
          Text: "black",
          Bar: "orange",
          Close: "red",
          Resize: "white",
          Background: (() => {
            let gradient = ctx.createLinearGradient(0, 0, 100, 100);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(0.2, "orange");
            gradient.addColorStop(0.4, "yellow");
            gradient.addColorStop(0.6, "green");
            gradient.addColorStop(0.7, "lightblue");
            gradient.addColorStop(0.8, "lightyellow");
            gradient.addColorStop(0.9, "lightpink");
            gradient.addColorStop(1, "black");

            return gradient;
          })(),
        },
        youtube: {
          Text: "black",
          Bar: "red",
          Close: "white",
          Resize: "white",
          Background: "pink",
        },
        oceanic: {
          Text: "white",
          Bar: "navy",
          Close: "red",
          Resize: "white",
          Background: "deepskyblue",
        },
        elegant: {
          Text: "black",
          Bar: "silver",
          Close: "red",
          Resize: "white",
          Background: "lavender",
        },
        minimalistic: {
          Text: "black",
          Bar: "grey",
          Close: "red",
          Resize: "grey",
          Background: "white",
        },
        sunset: {
          Text: "white",
          Bar: "#FF5733",
          Close: "#E8A628",
          Resize: "white",
          Background: "#FFC300",
        },
        forest: {
          Text: "white",
          Bar: "#008000",
          Close: "#FF5733",
          Resize: "white",
          Background: "#7CFC00",
        },
        royal: {
          Text: "white",
          Bar: "#483D8B",
          Close: "#FF5733",
          Resize: "white",
          Background: "#6A5ACD",
        },
        vintage: {
          Text: "black",
          Bar: "#9966CC",
          Close: "#CD5C5C",
          Resize: "white",
          Background: "#FFE4E1",
        },
        mountain: {
          Text: "white",
          Bar: "rgba(0,0,0,0.6)",
          Close: "rgba(255,0,0,0.8)",
          Resize: "white",
          Background: BackgroundCover(
            "https://wallpapercave.com/wp/wp4853028.jpg",
          ),
          BackgroundSize: "cover",
        },
        cityscape: {
          Text: "white",
          Bar: "rgba(0,0,0,0.6)",
          Close: "rgba(255,0,0,0.8)",
          Resize: "white",
          Background: BackgroundCover(
            "https://i.pinimg.com/736x/02/15/25/021525507a79c115108090ff2772476c.jpg",
          ),
          BackgroundSize: "cover",
        },

        Use: function (Theme) {
          WUT.Theme.Text = WUT.Theme.Presets[Theme].Text;
          WUT.Theme.Bar = WUT.Theme.Presets[Theme].Bar;
          WUT.Theme.Close = WUT.Theme.Presets[Theme].Close;
          WUT.Theme.Resize = WUT.Theme.Presets[Theme].Resize;
          WUT.Theme.Background = WUT.Theme.Presets[Theme].Background;
        },
      },
    },
  };
  return WUT;
}