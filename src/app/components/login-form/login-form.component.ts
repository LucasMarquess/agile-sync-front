import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  isLogin: boolean = true;
  login: string = '';
  password: string = '';


  formControl = new FormGroup({
    emailValidator: new FormControl('', [Validators.required, Validators.email])
  })

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.background = 'linear-gradient(to bottom, #024a92, #032b7c)';
  }

  changeIsLogin() {
    this.isLogin = !this.isLogin;
  }

  getErrorMessageEmail() {
    let control = this.formControl.controls.emailValidator;

    if (control.hasError('required')) {
      return 'Você precisa de adicionar um email';
    }

    return control.hasError('email') ? 'Email inválido' : '';
  }
}
