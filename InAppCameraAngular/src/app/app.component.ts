import { Component } from '@angular/core';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Observer } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

import { WebView } from '@ionic-native/ionic-webview/ngx';


export declare class writeOption {
  replace?: boolean;
  append?: boolean;
  truncate?: number;
}

const mobilePath = "file:///storage/emulated/0/OCS/data/";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {

  imgFile: string;

  title = 'InAppCameraAngular';
  
  fileWriteOption: writeOption;

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height-300,
    camera: 'rear',
    tapPhoto: true,
    previewDrag: true,
    toBack: true,
    alpha: 1
  }

  
  // picture options
  pictureOpts: CameraPreviewPictureOptions = {
    width: 1280,
    height: 1280,
    quality: 85
  }
  
  picture: string;
  originalImg: SafeResourceUrl;
  showPreview: boolean;
  showCropview: boolean;
  showCameraPreview: boolean = true;

  imageBase64: any = null;
  croppedImage: any = '';
  showOriginalImg: boolean;
  croppedPicture: any;


  constructor(private cameraPreview: CameraPreview,
    private file: File,
    private domSanitizer: DomSanitizer,
    private webview: WebView) { 
    // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview

    this.startCamera();
    // // Set the handler to run every time we take a picture
    // this.cameraPreview.setOnPictureTakenHandler().subscribe((result) => {
    //   console.log(result);
    //   // do something with the result
    // });




  

    // take a snap shot
    this.cameraPreview.takeSnapshot(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.picture = 'assets/img/test.jpg';
    });

    // Switch camera
    //this.cameraPreview.switchCamera();

    // set color effect to negative
    // this.cameraPreview.setColorEffect('negative');

    // Stop the camera preview
    //this.cameraPreview.stopCamera();

  }
  startCamera() {
    // start camera
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
    });
  }

  takePictureButton(){
      // take a picture
      this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
          // Stop the camera preview
          this.cameraPreview.stopCamera();

          //this.originalImg = this.domSanitizer.bypassSecurityTrustResourceUrl(this.picture);

          this.originalImg = this.picture;
          // console.log(this.originalImg);
     
          this.showPreview = true;
          this.showCropview = false;
          this.showCameraPreview = false;
          this.showOriginalImg = true;

          this.imageBase64 = null;

          // document.getElementById('originalPicture').style.display = 'block';

          // document.getElementById('originalPicture').src = URL.createObjectURL(blob);
          // document.getElementById("originalPicture").width = window.screen.width-20;
          // document.getElementById("originalPicture").style.marginTop = 20;
          // document.getElementById("originalPicture").style.marginLeft = 2;
          // document.getElementById('previewblock').style.display = 'block';
          // document.getElementById('camerablock').style.display = 'none';
      

      }, (err) => {
        console.log(err);
        this.picture = 'assets/img/test.jpg';
      });
    
  }

  deletePreview() {
    this.startCamera();
    this.originalImg= "";
    this.showPreview = false;
    this.showCropview = false;
    this.showCameraPreview = true;
  }

  confirmPreview() {
    console.log("Originm"+this.originalImg);
    this.imageBase64 = this.originalImg;
    this.showPreview = false;
    this.showCropview = true;
    this.showCameraPreview = false;
    this.showOriginalImg = false;


  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedPicture = event.base64;
  }

  confirmCrop() {
    this.croppedImage = this.croppedPicture;
    console.log("cropped image"+this.croppedImage);
    this.showOriginalImg = false;
    this.imageBase64 = "";

    // To define the type of the Blob
    var contentType = "image/png";
    // if cordova.file is not available use instead :
    // var folderpath = "file:///storage/emulated/0/";
    var folderpath = this.file.cacheDirectory;
    var filename = "ourcodeworld.png";

    this.savebase64AsImageFile(folderpath,filename,this.croppedImage,contentType);

    

  }

  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  
  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }

 b64toBlob(b64Data, contentType) {

  // Split the base64 string in data and contentType
  var block = b64Data.split(";");
  // Get the content type
  var dataType = block[0].split(":")[1];// In this case "image/png"

  console.log("DataType"+ dataType);
  // get the real base64 content of the file
  var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

    contentType = dataType || '';
    let sliceSize = 512;

    var byteCharacters = atob(realData);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

savebase64AsImageFile(folderpath,filename,content,contentType){
  // Convert the base64 string in a Blob
  var DataBlob = this.b64toBlob(content,contentType);
  
  console.log("Starting to write the file :3"+ DataBlob);

  //this.file.writeFile(this.file.e, "filename", this.blob, {replace: true, append: false});

 //this.file.createDir(folderpath, 'caseName', true).then(_=> {

    console.log('Directory Exist');

    this.fileWriteOption = {
      replace: true
    }
console.log(folderpath);
    this.file.writeFile(folderpath, filename, DataBlob, this.fileWriteOption).then((result)=>{
      console.log("result", result);
      this.imgFile = this.webview.convertFileSrc(result.nativeURL);
    }).catch((err)=>{
      console.log('Write '+JSON.stringify(err));
    });


//     }).catch(err =>{
//       console.log('Directory doesnt exist');
//  });


  // this.file.resolveLocalFileSystemURL(folderpath, function(dir) {
  //   console.log("Access to the directory granted succesfully");
  //   dir.getFile(filename, {create:true}, function(file) {
  //           console.log("File created succesfully.");
  //           file.createWriter(function(fileWriter) {
  //               console.log("Writing content to file");
  //               fileWriter.write(DataBlob);
  //           }, function(){
  //               alert('Unable to save file in path '+ folderpath);
  //           });
  //   });
  // });

}


  
}
