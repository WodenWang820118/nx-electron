import { Component } from '@angular/core';
import { TasksComponent } from '../components/tasks.component';

@Component({
  selector: 'app-tracker-view',
  imports: [TasksComponent],
  template: ` <app-tasks></app-tasks> `,
})
export class TrackerViewComponent {}
