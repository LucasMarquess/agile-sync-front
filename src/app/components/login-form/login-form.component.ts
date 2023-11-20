import { Component, ElementRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  isLogin: boolean = true;
  login: string = '';
  password: string = '';

  formulario = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      usuario: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
      confirmacaoSenha: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator('senha', 'confirmacaoSenha') }
  );

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background =
      'linear-gradient(to bottom, #024a92, #032b7c)';
  }

  changeIsLogin() {
    this.isLogin = !this.isLogin;
  }

  getErrorMessageEmail() {
    let control = this.formulario.controls.email;
    if (control.hasError('required')) {
      return 'Você precisa de adicionar um email.';
    }
    return control.hasError('email') ? 'Email inválido.' : '';
  }

  getErrorMessageUsuario() {
    let control = this.formulario.controls.usuario;
    if (control.hasError('required')) {
      return 'Você precisa de adicionar um usuário.';
    }
    return;
  }

  getErrorMessageSenha() {
    let control = this.formulario.controls.senha;
    if (control.hasError('required')) {
      return 'Você precisa de adicionar uma senha.';
    }
    return;
  }

  getErrorConfirmacaoSenha() {
    let control = this.formulario.controls.confirmacaoSenha;
    if (this.formulario.controls.senha.hasError('passwordMismatch')) {
      return 'As senhas não coincidem.';
    } else if (
      control.hasError('required') &&
      this.formulario.controls.senha.valid
    ) {
      return 'Você precisa confirmar a senha escolhida.';
    }
    return;
  }

  passwordMatchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get(controlName)?.value;
      const confirmPassword = control.get(matchingControlName)?.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
}
