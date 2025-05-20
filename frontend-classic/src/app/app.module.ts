import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TaskClarifierComponent } from './task-clarifier/task-clarifier.component';

@NgModule({

  declarations: [
    AppComponent,
  ],
  imports: [
    TaskClarifierComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [TaskClarifierComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

