import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-view',
  imports: [RouterLink],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-[600px] px-6 py-12"
    >
      <div
        class="max-w-2xl w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg"
      >
        <div class="mb-6">
          <div
            class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4"
          >
            <i class="pi pi-check-circle text-white text-4xl"></i>
          </div>
          <h4 class="text-lg text-gray-600 dark:text-slate-300 font-medium">
            Version 1.0.0
          </h4>
        </div>

        <div
          class="py-6 border-t border-b border-gray-200 dark:border-slate-700"
        >
          <p class="text-gray-700 dark:text-slate-300 leading-relaxed">
            A powerful and intuitive task management application built with
            Angular and NestJS. Keep track of your tasks, set reminders, and
            stay organized.
          </p>
        </div>

        <div class="pt-4">
          <a
            data-test-id="home-page-link"
            [routerLink]="['/']"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <i class="pi pi-home"></i>
            Back to Home
          </a>
        </div>

        <div class="pt-6 text-sm text-gray-500 dark:text-slate-400">
          <p>&copy; 2025 Task Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
})
export class AboutViewComponent {}
