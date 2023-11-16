import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  hidePassword: boolean = true;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.background = 'linear-gradient(to bottom, #024a92, #032b7c)';
  }
}
