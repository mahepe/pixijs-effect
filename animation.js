$(document).ready( () => {
    const AMOUNT = 2000;
    const COLOR = 0xffffff;
    const PIXI = window.PIXI;
    const canvas = document.getElementById("banner_canvas");

    var app = new PIXI.Application(window.innerWidth,
                                   window.innerHeight,
                                   {view: canvas,
                                    antialias: true,
                                    transparent: true});

    const drops = new PIXI.Container();
    app.stage.addChild(drops)

    const randomColor = () =>
          [0xff3366, 0x2ec4b6, 0x20a4f3][
              Math.floor(Math.random() * 3)
          ]

    const genParticles = (texture) =>
          new Array(AMOUNT).fill().map(p => {
              var p = new PIXI.Sprite(texture);
              let size = Math.floor(Math.random()*6)+3;
              p.sz = 1.7*size;
              p.width = p.sz;
              p.height = p.sz;
              p.x = Math.random()*window.innerWidth;
              p.y = Math.random()*window.innerHeight;
              p.offset = Math.random()*2*Math.PI;
              p.vx = 2/size;
              p.vy = 0;
              p.alpha = 20/(size*size);
              p.tint = randomColor();
              drops.addChild(p);
              return p;
          });

    // Create a base graphic for our sprites
    const p = new PIXI.Graphics()
    p.beginFill(COLOR)
    p.drawCircle(0, 0, 100)
    p.endFill()

    // Generate a base texture from the base graphic
    const baseTexture = app.renderer.generateTexture(p)
    let particles = genParticles(baseTexture)

    var time = 0;

    // Listen for animate update
    app.ticker.add(function(delta) {
        time += delta;
        if (
            app.renderer.height !== innerHeight ||
                app.renderer.width !== innerWidth
        ) {
            app.renderer.resize(innerWidth, innerHeight)
            drops.removeChildren()
            particles = genParticles(baseTexture)
        }
        for(let p of particles){
            p.x += delta*p.vx;
            p.y += delta*p.vy;
            p.width = (Math.sin(time/100+p.offset)+1)*p.sz;
            p.height = (Math.sin(time/100+p.offset)+1)*p.sz;
            if(p.x >= window.innerWidth + 20){
                p.x = -20;
            }
        }
        app.renderer.render(drops);
    });
});
