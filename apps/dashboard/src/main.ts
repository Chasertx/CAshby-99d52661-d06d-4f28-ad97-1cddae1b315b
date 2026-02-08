import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppShell {}

// Initializes the app with global providers and routing
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))