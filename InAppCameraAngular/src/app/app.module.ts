import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';

import { ImageCropperModule } from 'ngx-image-cropper';

import { File } from '@ionic-native/file/ngx';

import { WebView } from '@ionic-native/ionic-webview/ngx';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageCropperModule
  ],
  providers: [
    CameraPreview,
    File,
    WebView
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
