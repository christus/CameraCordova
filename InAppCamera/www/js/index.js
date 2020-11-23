/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {

    cropper:"",
    startCameraAbove: function(){
        options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height-200,
            camera: "back",
            toBack: false,
            tapPhoto: true,
            tapFocus: false,
            previewDrag: false,
            storeToFile: true,
            disableExifHeaderStripping: false
        },
        
      CameraPreview.startCamera(options);
    },
  
    startCameraBelow: function(){
      CameraPreview.startCamera({x: 50, y: 50, width: 300, height:300, camera: "front", tapPhoto: true, previewDrag: false, toBack: true});
    },
  
    stopCamera: function(){
      CameraPreview.stopCamera();
    },
  
    takePicture: function(){
        var that = this;
        CameraPreview.takePicture(function(data){
        if(navigator.userAgent.match(/Android/i)  == "Android"){
            console.log("Take picture file path"+ 'file://' + data);
            CameraPreview.getBlob('file://' + data, function(image) {
                displayImage(image);
            });
        }
        //document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
        CameraPreview.stopCamera();
      });
    },



    switchCamera: function(){
      CameraPreview.switchCamera();
    },
  
    show: function(){
      CameraPreview.show();
    },
  
    hide: function(){
      CameraPreview.hide();
    },
  
    changeColorEffect: function(){
      var effect = document.getElementById('selectColorEffect').value;
      CameraPreview.setColorEffect(effect);
    },
  
    changeFlashMode: function(){
      var mode = document.getElementById('selectFlashMode').value;
      CameraPreview.setFlashMode(mode);
    },
  
    changeZoom: function(){
      var zoom = document.getElementById('zoomSlider').value;
      document.getElementById('zoomValue').innerHTML = zoom;
      CameraPreview.setZoom(zoom);
    },
  
    changePreviewSize: function(){
      window.smallPreview = !window.smallPreview;
      if(window.smallPreview){
        CameraPreview.setPreviewSize({width: 100, height: 100});
      }else{
        CameraPreview.setPreviewSize({width: window.screen.width, height: window.screen.height});
      }
    },
  
    showSupportedPictureSizes: function(){
      CameraPreview.getSupportedPictureSizes(function(dimensions){
        dimensions.forEach(function(dimension) {
          console.log(dimension.width + 'x' + dimension.height);
        });
      });
    },

    confirmPic: function(){
        alert("confirm");
        document.getElementById('previewblock').style.display = 'block';
        document.getElementById('cropblock').style.display = 'block';

        const image = document.getElementById('originalPicture');
        cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
          crop(event) {
              console.log(event.detail.x);
              console.log(event.detail.y);
              console.log(event.detail.width);
              console.log(event.detail.height);
              console.log(event.detail.rotate);
              console.log(event.detail.scaleX);
              console.log(event.detail.scaleY);
          },
        });        
        
    },

    cropPic: function(){
      document.getElementById('originalPicture').style.display = 'none';
      cropper.getCroppedCanvas().toBlob((blob) => {
        cropper.destroy();
        document.getElementById('croppedPicture').src = URL.createObjectURL(blob);

        var directoryPath = cordova.file.externalCacheDirectory

        window.resolveLocalFileSystemURL(directoryPath, function (dirEntry) {
          console.log('file system open: ' + dirEntry.name);

          dirEntry.getFile("downloadedImage.png" , { create: true, exclusive: false }, function (fileEntry) {

            console.log("fileEntry"+fileEntry);

            writeFile(fileEntry, blob);
  
          }, function (){
            console.log("Error");
          });
  
        });   
      });       
    },
  
  
    init: function(){
     // document.getElementById('startCameraAboveButton').addEventListener('click', this.startCameraAbove, false);
    //  document.getElementById('startCameraBelowButton').addEventListener('click', this.startCameraBelow, false);
  
    //  document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
        document.getElementById('switchCameraButton').addEventListener('click', this.switchCamera, false);
    //  document.getElementById('showButton').addEventListener('click', this.show, false);
    //  document.getElementById('hideButton').addEventListener('click', this.hide, false);
        document.getElementById('takePictureButton').addEventListener('click', this.takePicture, false);
    //  document.getElementById('selectColorEffect').addEventListener('change', this.changeColorEffect, false);
    //  document.getElementById('selectFlashMode').addEventListener('change', this.changeFlashMode, false);
        document.getElementById('confirm').addEventListener('click', this.confirmPic, false);
        document.getElementById('delete').addEventListener('click', this.startCameraAbove, false);

        document.getElementById('previewblock').style.display = 'none';
        
        document.getElementById('cropblock').style.display = 'none';

        document.getElementById('cropConfirm').addEventListener('click', this.cropPic, false);


      if(navigator.userAgent.match(/Android/i)  == "Android"){
     //   document.getElementById('zoomSlider').addEventListener('change', this.changeZoom, false);
      }else{
        document.getElementById('androidOnly').style.display = 'none';
      }
  
      window.smallPreview = false;
    //  document.getElementById('changePreviewSize').addEventListener('click', this.changePreviewSize, false);
  
     // document.getElementById('showSupportedPictureSizes').addEventListener('click', this.showSupportedPictureSizes, false);
  
      // legacy - not sure if this was supposed to fix anything
      //window.addEventListener('orientationchange', this.onStopCamera, false);

      this.startCameraAbove();
    }
  };
  

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    app.init();
}

function displayImage(blob) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();

    img.onload = function(){
      ctx.drawImage(img, 0, 0)
    }

    document.getElementById('originalPicture').style.display = 'block';

    document.getElementById('originalPicture').src = URL.createObjectURL(blob);
    document.getElementById("originalPicture").width = window.screen.width-20;
    document.getElementById("originalPicture").style.marginTop = 20;
    document.getElementById("originalPicture").style.marginLeft = 2;
    document.getElementById('previewblock').style.display = 'block';
    document.getElementById('camerablock').style.display = 'none';

}

function writeFile(fileEntry, dataObj) {
  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {

      fileWriter.onwriteend = function() {
          console.log("Successful file write...");
          readFile(fileEntry);
      };

      fileWriter.onerror = function (e) {
          console.log("Failed file write: " + e.toString());
      };

      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
          dataObj = new Blob(['some file data'], { type: 'text/plain' });
      }

      fileWriter.write(dataObj);
  });
}

function readFile(fileEntry) {

  fileEntry.file(function (file) {
      var reader = new FileReader();

      reader.onloadend = function() {
          console.log("Successful file read: " + this.result);
          //displayFileData(fileEntry.fullPath + ": " + this.result);
         // displayFileData(fileEntry.fullPath + ": " + this.result);

          var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
          displayImage(blob);

      };

      reader.readAsText(file);

  }, function(error){
    console.log("Err"+error)
  });
}

