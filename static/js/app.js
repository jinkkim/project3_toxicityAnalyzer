function drawPlot(toxicity){
  // Enter a speed between 0 and 180
  var toxicity_angle = 180 * toxicity;

  // Trig to calc meter point
  var degrees = 180 - toxicity_angle,
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'toxicity',
      text: toxicity_angle,
      hoverinfo: 'text+name'},
    { 
    values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],
    rotation: 90,
    text: ['Severe Toxic!', 'Moderate Toxic', 'Slightly Toxic', 'Generous', 'Angel!'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:[ 'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                      'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(255, 255, 255, 0)']},
    labels: ['1.00~0.80', '0.79~0.60', '0.59~0.40', '0.39~0.20', '0.19-0.00'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    //title: '<b>Toxicity</b>',
    height: 650,
    width: 650,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);

}


//reference: https://bl.ocks.org/Fil/4748d004e6d17a6f044856d6454f75f6
var analysis_text = ""

drawPlot(toxicity)
var modal = d3.select("#myModal")

d3.select("#analyze").on("click", function(){

  modal.style("display","block")  
  analysis_text = $("#analyze_text").val()
  console.log(analysis_text)

  setTimeout(function(){
    location.reload();
    console.log("page reloaded")
  }, 30000)

  d3.json('/analyze_this', {
      method:"POST",
      body: JSON.stringify({
        "analyze_this" : analysis_text,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
  })


  
})
    