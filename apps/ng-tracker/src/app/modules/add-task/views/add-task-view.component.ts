import { Component } from '@angular/core';
import { TaskFormComponent } from '../components/task-form.component';

@Component({
  selector: 'app-add-task-view',
  imports: [TaskFormComponent],
  template: ` <app-task-form></app-task-form> `,
})
export class AddTaskViewComponent {}
