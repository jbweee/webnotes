console.log('hello');

var url = "https://api.clarifai.com/v2/models/e9576d86d2004ed1a38ba0cf39ecb4b1/outputs";

function getNSFWNumber() {
  chrome.storage.sync.get(['nsfwNumber'], function(items) {
      var imgArray = document.getElementsByTagName('img');
      console.log(imgArray);
      for (var j = 0; j < imgArray.length; j++) {
        process(imgArray[j], items.nsfwNumber);
      }
  });
}

function process(img,nsfwNumber) {
  console.log('processing', img.src);

  var data = {
    "inputs": [
    {
      "data": {
        "image": {
          "url": img.src
        }
      }
    }
    ]
  };

  data = JSON.stringify(data);
  var nsfwPercent = nsfwNumber / 100;
  console.log('nsfwpercent '+ nsfwPercent);
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: data,
    headers: {
      "Authorization" :"Key cb932ea3884847718878a5960bbdbc9e",
      "Content-Type" :"application/json"
    },
    success: function(response) {
      console.log('done', img.src);
      if (response.outputs[0].data.concepts[0].name === "sfw") {
        var sfwVal = response.outputs[0].data.concepts[0].value;
      } else if (response.outputs[0].data.concepts[0].name === "nsfw") {
        var nsfwVal = response.outputs[0].data.concepts[0].value;
      }
      if (nsfwVal > nsfwPercent) {
        console.log('nsfw value is over the number, ' + nsfwPercent);
        // console.log(imgArray);
        // images[i]= document.images[i].src;
        // Document object (web page)
        //   .images =>
        // for each image in here, throwinto api call
        var currentHeight = img.height + 'px';
        var currentWidth = img.width + 'px';
        // console.log(currentHeight);
        // console.log(currentWidth);
        img.style.height = currentHeight;
        img.style.width = currentWidth;
        var ratioHeight = parseFloat(img.height);
        var ratioWidth = parseFloat(img.width);
        var ratio = (ratioHeight/ratioWidth);
        console.log(ratio);
        if (ratio < 0.75) {
          img.src = "http://www.petguide.com/wp-content/uploads/2014/10/cutest-dog-breeds-main.jpg";
        } else if (ratio > 1.25) {
          img.src = "https://img.buzzfeed.com/buzzfeed-static/static/2015-12/3/15/enhanced/webdr07/enhanced-26461-1449174160-14.jpg?downsize=715:*&output-format=auto&output-quality=auto";
        } else {
          img.src = "https://i.imgur.com/IEYInUL.jpg";
        }
      }
    }
  });
}

window.onload = function() {
  /*var imgArray = document.getElementsByTagName('img');
  console.log(imgArray);
  for (var j = 0; j < imgArray.length; j++) {
    var nsfwNumber = getNSFWNumber();
    console.log('we got nsfw nuber from its function: ' + nsfwNumber);
    process(imgArray[j], nsfwNumber);
  }*/
  getNSFWNumber();
  
  return;
}
