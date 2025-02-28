import { Component, HostListener } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'agile-sync-front';

  constructor(public spinnerService: SpinnerService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.spinnerService.isVisible) {
      event.preventDefault();
    }
  }
}
