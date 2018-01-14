
var Animation = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.t = 0;
    this.timeInterval = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.frame = 0;
    this.animating = false;

    //domaganie sie od przeglądarki o odświerzenie przy następnym malowaniu
    window.requestAnimFrame = (function(callback){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
};

Animation.prototype.getContext = function (){
    return this.context;
};

Animation.prototype.getCanvas = function(){
    return this.canvas;
};

Animation.prototype.clear = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Animation.prototype.setStage = function(func){
    this.stage = func;
};

Animation.prototype.start = function(){
    this.animating = true;
    var date = new Date();
    this.startTime = date.getTime();
    this.lastTime = this.startTime;

    if (this.stage !== undefined){
        this.stage();
    }

    this.animationLoop();
};

Animation.prototype.getTime = function(){
    return this.t;
};

Animation.prototype.animationLoop = function(){

    var that = this;
    this.frame++;
    var date = new Date();
    var thisTime = date.getTime();
    this.timeInterval = thisTime - this.lastTime; //obliczenie różnicy czasu między klatkami 60 razy na sekunde
    this.t += this.timeInterval;
    this.lastTime = thisTime;


    if (this.stage !== undefined){
        this.stage(); //update sceny
    }

    if (this.animating){
        window.requestAnimFrame(function(){
            that.animationLoop();
        });
    }

};

function Start(){

    var anim = new Animation("myCanvas");
    var context = anim.getContext();
    var canvas = anim.getCanvas();
    var Amp=document.getElementById("ampl").value;
    var Leng=document.getElementById("leng").value;
    var amplitude =(Amp*Math.PI)/180;
    var period = (2*Math.PI)*Math.sqrt((Leng/3779.53)/9.81)*10000;
    var theta = 0;
    var pendulumLength = Leng;
    var pendulumWidth = 5;
    var rotationPointX = canvas.width / 2;
    var rotationPointY = 20;


    anim.setStage(function(){
        //update
        theta = (amplitude * Math.sin((2 * Math.PI * this.getTime()) / period)) + Math.PI / 2;

        //show info Amplitude(rad,degree) and Time
        document.getElementById("demo").value=(theta-Math.PI/2).toPrecision(2);
        document.getElementById("demo2").value=((theta*180/Math.PI)-90).toPrecision(2);
        document.getElementById("demo3").value=this.getTime()/1000;

        //clear
        this.clear();

        //draw top circle
        context.beginPath();
        context.arc(rotationPointX, rotationPointY, 15, 0, 2 * Math.PI, false);
        context.fillStyle = "brown";
        context.fill();

        //draw shaft
        context.beginPath();
        var endPointX = rotationPointX + (pendulumLength * Math.cos(theta));
        var endPointY = rotationPointY + (pendulumLength * Math.sin(theta));
        context.beginPath();
        context.moveTo(rotationPointX, rotationPointY);
        context.lineTo(endPointX, endPointY);
        context.lineWidth = pendulumWidth;
        context.lineCap = "round";
        context.strokeStyle = "red";
        context.stroke();

        //draw bottom circle
        context.beginPath();
        context.arc(endPointX, endPointY, 40, 0, 2 * Math.PI, false);
        var grd = context.createLinearGradient(endPointX - 50, endPointY - 50, endPointX + 50, endPointY + 50);
        grd.addColorStop(0, "#991f00");
        grd.addColorStop(0.5, "white");
        grd.addColorStop(1, "#ff3300");
        context.fillStyle = grd;
        context.fill();

        //show X and Y
        document.getElementById("demo4").value=endPointX.toPrecision(4);
        document.getElementById("demo5").value=endPointY.toPrecision(4);
    });
    anim.start();
};
