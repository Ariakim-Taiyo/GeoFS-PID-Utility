let valueToGraph = "atilt"; //The animation value to use
let valueGraphed;           //Leave blank
let graphTitle = "Pitch Angle";   //Title of the graph. Purely aesthetic.
let apObject = geofs.autopilot.PIDs.pitchAngle; //Change this to other PID objects if you want to debug those.


let valueSetInterval = setInterval(function(){
  valueGraphed = geofs.animation.values[valueToGraph];
},100)
var script1 = document.createElement('script');
script1.type = 'text/javascript';
script1.src = 'https://www.gstatic.com/charts/loader.js';
document.head.appendChild(script1);

setTimeout(function() {
  let newDiv = document.createElement("div")
  newDiv.id = "chart_div"
  newDiv.style = "display: flex; flex-direction: column; justify-content: space-evenly;"
  document.body.appendChild(newDiv)
  google.charts.load("current", {
    packages: ["corechart", "line"]
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    let data = google.visualization.arrayToDataTable([
      ["Year", "CPU Usage"],
      [0, 0]
    ]);
    let options = {
      curveType: 'function',
      title: graphTitle,
      height: Math.floor(geofs.viewport.clientHeight * 0.75),
      hAxis: {
        scaleType: 'none',
        title: "Time"
      },
      vAxis: {
        title: "Rate",
        viewWindow: {
          min: -1,
          max: 1
        }
      }
    };
    setTimeout(function() {
      let chart = new google.visualization.LineChart(
        document.getElementById("chart_div")
      );
      chart.draw(data, options);
      let index = 0;
      setInterval(function() {
        data.addRow([index, valueGraphed]);
        if (index > 10) {
          data.removeRow(0);
          for (let i = 0; i < data.getNumberOfRows(); i++) {
            data.setValue(i, 0, i);
          }
        }
        chart.draw(data, options);
        index++;
      }, 250);
      createSliders();
    }, 2000);
  }
}, 1000)

function createSliders() {
  var sliderDiv = document.createElement("div");
  sliderDiv.style = "display: flex; justify-content: space-evenly; align-items: center; margin-top: 10px;";

  var labelsDiv = document.createElement("div");
  labelsDiv.style = "display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; margin-top: 10px;";

  var pLabel = document.createElement("label");
  pLabel.innerHTML = "P";
  pLabel.setAttribute("for", "pSlider");

  var iLabel = document.createElement("label");
  iLabel.innerHTML = "I";
  iLabel.setAttribute("for", "iSlider");

  var dLabel = document.createElement("label");
  dLabel.innerHTML = "D";
  dLabel.setAttribute("for", "dSlider");

  labelsDiv.appendChild(pLabel);
  labelsDiv.appendChild(iLabel);
  labelsDiv.appendChild(dLabel);



  var pSlider = document.createElement("input");
  pSlider.type = "range";
  pSlider.min = 0;
  pSlider.max = 10;
  pSlider.value = 0;
  pSlider.step = 0.01;
  pSlider.id = "pSlider";

  var iSlider = document.createElement("input");
  iSlider.type = "range";
  iSlider.min = 0;
  iSlider.max = 10;
  iSlider.value = 0;
  iSlider.step = 0.01;
  iSlider.id = "iSlider";

  var dSlider = document.createElement("input");
  dSlider.type = "range";
  dSlider.min = 0;
  dSlider.max = 10;
  dSlider.value = 0;
  dSlider.step = 0.01;
  dSlider.id = "dSlider";

  pSlider.addEventListener("wheel", function(e) {
    if (e.deltaY < 0) {
      pSlider.valueAsNumber += 0.01;
    } else {
      pSlider.value -= 0.01;
    }
    e.preventDefault();
    e.stopPropagation();
  })

  iSlider.addEventListener("wheel", function(e) {
    if (e.deltaY < 0) {
      iSlider.valueAsNumber += 0.01;
    } else {
      iSlider.value -= 0.01;
    }
    e.preventDefault();
    e.stopPropagation();
  })

  dSlider.addEventListener("wheel", function(e) {
    if (e.deltaY < 0) {
      dSlider.valueAsNumber += 0.01;
    } else {
      dSlider.value -= 0.01;
    }
    e.preventDefault();
    e.stopPropagation();
  })

  sliderDiv.appendChild(pSlider);
  sliderDiv.appendChild(iSlider);
  sliderDiv.appendChild(dSlider);

  var updateSlidersInt = setInterval(function() {
    pLabel.innerHTML = "P: " + pSlider.value;
    iLabel.innerHTML = "I: " + iSlider.value;
    dLabel.innerHTML = "D: " + dSlider.value;
  }, 100)

  pSlider.value = apObject._kp;
  iSlider.value = apObject._ki;
  dSlider.value = apObject._kd;

  var updatePIDSInt = setInterval(function() {
      apObject._kp = pSlider.value;
      apObject._ki = iSlider.value;
      apObject._kd = dSlider.value;
  }, 100)
  document.getElementById("chart_div").appendChild(labelsDiv);
  document.getElementById("chart_div").appendChild(sliderDiv);
};
