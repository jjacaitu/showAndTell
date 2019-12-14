let video;
let x= 0;
let y = 0;



let mobilenet;
let classifier;
function setup() {
    
    $("input[type=file]").attr("disabled","true");
    
    classifier = ml5.imageClassifier('MobileNet', () => {
                
        $("input[type=file]").removeAttr("disabled");
    });
    
    $("input[type=file]").on("change", (e) => {
         
        const file = e.target.files[0];
    
        const tmppath = URL.createObjectURL(file);
    
        const img = $("#myImage")[0];
        
        img.src = tmppath;
    
        setTimeout(() => {
            classifier.predict(img, (err, result) => {
                console.log(result)
                $(".prediction").text(result[0].label);
            });
        }, 100);
    })
      
    
    $(".thankYou").hide();
    $(".pointer").hide();
    $(".endButton").hide();
    
    $(".startWebcam").on("click", startWebcam);
}

   


function startWebcam() {
    video = createCapture(VIDEO);
    video.hide();

    // Sound classifier to be able to "click" the button saying "yes";

    const soundClassifier = ml5.soundClassifier("SpeechCommands18w");

    soundClassifier.classify(gotSounds);

    $(".startWebcam").fadeOut();
    $(".endButton").fadeIn();


     // Posenet to be able to control the icon of a pointer with the webcam
    
    const poseNet = ml5.poseNet(video, posenetModelReady);
    poseNet.on("pose", gotPoses);
}



function gotPoses(poses) {
    if (poses.length) {
        x = poses[0].pose.keypoints[0].position.x;
        y = poses[0].pose.keypoints[0].position.y;
        $(".pointer").css("right", `${(x/600) * 100}vw`);
        $(".pointer").css("top", `${(y / 400) * 100}vh`);
        
    }
    // console.log(poses[0].pose.keypoints[0].position);
}

$(".endButton").on("click", () => {
    $(`.thankYou`).fadeIn();
    for (let i = 0; i < 250; i++) {
        create(i);
    }
})

function gotSounds(error, results){
    if (results[0].label === "yes") {
        // console.log("click!!!")
        const buttonPosition = $(`.endButton`).position();
        const pointerPosition = $(`.pointer`).position();

        if ((pointerPosition.left >= buttonPosition.left && pointerPosition.left <= (buttonPosition.left + 300)) && (pointerPosition.top >= buttonPosition.top && (pointerPosition.top <= (buttonPosition.top + 100)))) {
            console.log("button clicked!!");
            $(`.thankYou`).fadeIn();
            for (let i = 0; i < 250; i++) {
                create(i);
            }
        }
    }
    
}

function posenetModelReady() {
    console.log("ready!");
    $(".pointer").fadeIn();
}



function create(i) {
    var width = Math.random() * 15;
    var height = width * 0.4;
    var colourIdx = Math.ceil(Math.random() * 3);
    var colour = "red";
    switch (colourIdx) {
        case 1:
            colour = "yellow";
            break;
        case 2:
            colour = "blue";
            break;
        default:
            colour = "red";
    }
    $('<div class="confetti-' + i + ' ' + colour + '"></div>').css({
        "width": width + "px",
        "height": height + "px",
        "top": -Math.random() * 20 + "%",
        "left": Math.random() * 100 + "%",
        "opacity": Math.random() + 0.5,
        "transform": "rotate(" + Math.random() * 360 + "deg)"
    }).appendTo('.wrapper');

    drop(i);
}

function drop(x) {
    $('.confetti-' + x).animate({
        top: "100%",
        left: "+=" + Math.random() * 15 + "%"
    }, Math.random() * 3000 + 3000, function () {
        reset(x);
    });
}

function reset(x) {
    $('.confetti-' + x).animate({
        "top": -Math.random() * 20 + "%",
        "left": "-=" + Math.random() * 15 + "%"
    }, 0, function () {
        drop(x);
    });
}

