
(function oneko() {
    const nekoSpeed = // oneko.js: https://github.com/adryd325/oneko.js
        (function oneko() {
            const nekoEl = document.createElement("div");

            let nekoPosX = 32+(Math.random()*20);
            let nekoPosY = 32+(Math.random()*20);

            let nekoVelocityX = 0;
            let nekoVelocityY = 0;

            let mousePosX = 0;
            let mousePosY = 0;
            let mouseDown = 0;

            let diffx1 = 0
            let diffx2 = 0
            let diffy1 = 0
            let diffy2 = 0


            const isReducedMotion =
                window.matchMedia("(prefers-reduced-motion: reduce)") === true ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;

            if (isReducedMotion) {
                return;
            }

            let frameCount = 0;
            let idleTime = 0;
            let idleAnimation = null;
            let idleAnimationFrame = 0;
            let lastframedrag = false;

            const nekoSpeed = 2398;
            const spriteSets = {
                idle: [[-3, -3]],
                alert: [[-7, -3]],
                scratchSelf: [
                    [-5, 0],
                    [-5, 0],
                    [-6, 0],
                    [-6, 0],
                    [-7, 0],
                    [-7, 0],
                ],
                scratchWallN: [
                    [0, 0],
                    [0, 0],
                    [0, -1],
                    [0, -1],
                ],
                scratchWallS: [
                    [-7, -1],
                    [-7, -1],
                    [-6, -2],
                    [-6, -2],
                ],
                scratchWallE: [
                    [-2, -2],
                    [-2, -2],
                    [-2, -3],
                    [-2, -3],
                ],
                scratchWallW: [
                    [-4, 0],
                    [-4, 0],
                    [-4, -1],
                    [-4, -1],
                ],
                tired: [[-3, -2]],
                sleeping: [
                    [-2, 0],
                    [-2, 0],
                    [-2, -1],
                    [-2, -1],
                ],
                N: [
                    [-1, -2],
                    [-1, -2],
                    [-1, -3],
                    [-1, -3],
                ],
                NE: [
                    [0, -2],
                    [0, -2],
                    [0, -3],
                    [0, -3],
                ],
                E: [
                    [-3, 0],
                    [-3, 0],
                    [-3, -1],
                    [-3, -1],
                ],
                SE: [
                    [-5, -1],
                    [-5, -1],
                    [-5, -2],
                    [-5, -2],
                ],
                S: [
                    [-6, -3],
                    [-6, -3],
                    [-7, -2],
                    [-7, -2],
                ],
                SW: [
                    [-5, -3],
                    [-5, -3],
                    [-6, -1],
                    [-6, -1],
                ],
                W: [
                    [-4, -2],
                    [-4, -2],
                    [-4, -3],
                    [-4, -3],
                ],
                NW: [
                    [-1, 0],
                    [-1, 0],
                    [-1, -1],
                    [-1, -1],
                ],
                dragidle: [[0, -4]],
                dragR: [[-1, -4]],
                dragL: [[-2, -4]],
            };

            function init() {
                nekoEl.id = "oneko";
                nekoEl.ariaHidden = true;
                nekoEl.style.width = "32px";
                nekoEl.style.height = "32px";
                nekoEl.style.position = "fixed";
                nekoEl.style.pointerEvents = "none";
                nekoEl.style.backgroundImage = "url('https://github.com/duqc/onekofake/blob/main/onekofakedrag.gif?raw=true')";
                nekoEl.style.imageRendering = "pixelated";
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
                nekoEl.style.zIndex = Number.MAX_VALUE;
                nekoEl.style.cursor = 'none';

                document.body.appendChild(nekoEl);

                document.addEventListener("mousemove", function (event) {
                    mousePosX = event.clientX;
                    mousePosY = event.clientY;
                })

                
                
                window.requestAnimationFrame(onAnimatonFrame);
            }

            let lastFrameTimestamp;

            function onAnimatonFrame(timestamp) {
                document.onmousedown = function() { 
                ++mouseDown;
                console.log("mouse down", mouseDown)
                }
                document.onmouseup = function() {
                mouseDown = 0;
                console.log ("mouse up", mouseDown)
                }
                // Stops execution if the neko element is removed from DOM
                if (!nekoEl.isConnected) {
                    return;
                }
                if (!lastFrameTimestamp) {
                    lastFrameTimestamp = timestamp;
                }
                if (timestamp - lastFrameTimestamp > 25) {
                    lastFrameTimestamp = timestamp;
                    frame();
                }
                window.requestAnimationFrame(onAnimatonFrame);
            }

            function setSprite(name, frame) {
                const sprite = spriteSets[name][frame % spriteSets[name].length];
                if (!sprite){
                    console.log("Sprite is undefined")
                    return(1)
                }
                nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
            }

            function resetIdleAnimation() {
                idleAnimation = null;
                idleAnimationFrame = 0;
            }

            function idle() {
                nekoVelocityX = nekoVelocityX*0.5;
                nekoVelocityY = nekoVelocityY*0.5;

                nekoPosY += nekoVelocityY;

                nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
                nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;

                idleTime += 1;

                // every ~ 20 seconds
                    if (
                    idleTime > 10 &&
                    Math.floor(Math.random() * 200) == 0 &&
                    idleAnimation == null
                ) {
                    const avalibleIdleAnimations = ["sleeping", "scratchSelf"];
                    if (nekoPosX < 32) {
                        avalibleIdleAnimations.push("scratchWallW");
                    }
                    if (nekoPosY < 32) {
                        avalibleIdleAnimations.push("scratchWallN");
                    }
                    if (nekoPosX > window.innerWidth - 32) {
                        avalibleIdleAnimations.push("scratchWallE");
                    }
                    if (nekoPosY > window.innerHeight - 32) {
                        avalibleIdleAnimations.push("scratchWallS")
                    }
                    idleAnimation =
                        avalibleIdleAnimations[
                        Math.floor(Math.random() * avalibleIdleAnimations.length)
                        ];
                }

                switch (idleAnimation) {
                    case "sleeping":
                        if (idleAnimationFrame < 8) {
                            setSprite("tired", 0);
                            break;
                        }
                        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                        if (idleAnimationFrame > 192) {
                            resetIdleAnimation();
                        }
                        break;
                    case "scratchWallN":
                    case "scratchWallS":
                    case "scratchWallE":
                    case "scratchWallW":
                    case "scratchSelf":
                        setSprite(idleAnimation, idleAnimationFrame);
                        if (idleAnimationFrame > 9) {
                            resetIdleAnimation();
                        }
                        break;
                    default:
                        setSprite("idle", 0);
                        return;
                }
                idleAnimationFrame += 0.5;
            }

            function drag(){
                const diffX = nekoPosX - mousePosX;
                const diffY = nekoPosY - mousePosY;


                if (nekoVelocityX > 30){
                    setSprite("dragL",0);
                }
                else if(nekoVelocityX < -30){
                    setSprite("dragR",0);
                }
                else{
                    setSprite("dragidle",0);
                }

                nekoPosX = mousePosX;
                nekoPosY = mousePosY;

                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY +40 - 16}px`;

                nekoVelocityX += (-diffX)/1.5
                nekoVelocityY += (-diffY)/1.5

                nekoVelocityX = nekoVelocityX*0.8
                nekoVelocityY = nekoVelocityY*0.8

                lastframedrag = true

                diffx1 = diffX
                diffx2 = diffx1
                diffy1 = diffY
                diffy2 = diffy1
            }

            function frame() {
                a = nekoEl.cloneNode()
                frameCount += 0.25;
                const diffX = nekoPosX - mousePosX;
                const diffY = nekoPosY - mousePosY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                if(mouseDown == 1 & distance < 48 || lastframedrag == true & mouseDown == 1){
                        drag();
                        return;
                    }
                lastframedrag = false;
                if (distance < nekoSpeed || distance < 48) {
                    
                    idle();
                    return;
                }

                idleAnimation = null;
                idleAnimationFrame = 0;

                if (idleTime > 1) {
                    setSprite("alert", 0);
                    // count down after being alerted before moving
                    idleTime = Math.min(idleTime, 7);
                    idleTime -= 1;
                    nekoVelocityX = nekoVelocityX * 0.95;
                    nekoVelocityY = nekoVelocityY * 0.95;

                    nekoPosX += nekoVelocityX;
                    nekoPosY += nekoVelocityY;

                    nekoEl.style.left = `${nekoPosX - 16}px`;
                    nekoEl.style.top = `${nekoPosY - 16}px`;
                    return;
                }

                let direction;
                direction = diffY / distance > 0.5 ? "N" : "";
                direction += diffY / distance < -0.5 ? "S" : "";
                direction += diffX / distance > 0.5 ? "W" : "";
                direction += diffX / distance < -0.5 ? "E" : "";
                setSprite(direction, Math.floor(frameCount));
                
                nekoVelocityX -= ((diffX / distance) * nekoSpeed)/4;
                nekoVelocityY -= ((diffY / distance) * nekoSpeed)/4;

                nekoVelocityX = nekoVelocityX * 0.95;
                nekoVelocityY = nekoVelocityY * 0.95;


                nekoPosX += nekoVelocityX;
                nekoPosY += nekoVelocityY;

                nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
                nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

                if (nekoPosX == 16 || nekoPosX == window.innerWidth-16){
                    nekoVelocityX = -nekoVelocityX
                } 
                if (nekoPosY == 16 || nekoPosY == window.innerHeight-16){
                    nekoVelocityY = -nekoVelocityY
                } 
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
            }
            init();
        })();
})();