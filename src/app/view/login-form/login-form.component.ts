import { AuthenticationStore } from '../../services/stores/authentication.store';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthenticationModel } from 'src/app/models/authentication.model';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  isLogin: boolean = true;
  usuario!: string;
  password!: string;
  email!: string;
  resquestLoading: boolean = false;

  formulario!: FormGroup;

  constructor(
    private elementRef: ElementRef,
    private toastr: ToastrService,
    private authenticationStore: AuthenticationStore
  ) {
    this.createFormGroup();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background =
      'linear-gradient(to bottom, #024a92, #032b7c)';
  }

  createFormGroup() {
    this.formulario = new FormGroup({
      usuario: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
      ]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
    });
    if (!this.isLogin) {
      this.formulario.addControl(
        'email',
        new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(90),
        ])
      );
      this.formulario.addControl(
        'confirmacaoSenha',
        new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ])
      );
      this.formulario.addValidators(
        this.passwordMatchValidator('senha', 'confirmacaoSenha')
      );
    }
  }

  changeIsLogin() {
    this.isLogin = !this.isLogin;
    this.createFormGroup();
  }

  getErrorMessageEmail() {
    let control = this.formulario.controls['email'];
    if (control.hasError('required')) {
      return 'É necessário informar um email.';
    } else if (control.hasError('maxlength')) {
      return 'O email deve conter até 90 caracteres.';
    }
    return control.hasError('email') ? 'Email inválido.' : '';
  }

  getErrorMessageUsuario() {
    let control = this.formulario.controls['usuario'];
    if (control.hasError('required')) {
      return 'É necessário informar um usuário.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'O usuário deve conter entre 4 e 40 caracteres.';
    }
    return;
  }

  getErrorMessageSenha() {
    let control = this.formulario.controls['senha'];
    if (control.hasError('required')) {
      return 'É necessário informar uma senha.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'A senha deve conter entre 6 e 12 caracteres.';
    }
    return;
  }

  getErrorConfirmacaoSenha() {
    let control = this.formulario.controls['confirmacaoSenha'];
    if (control.hasError('passwordMismatch')) {
      return 'As senhas não coincidem.';
    } else if (
      control.hasError('required') &&
      this.formulario.controls['senha'].valid
    ) {
      return 'É necessário confirmar a senha.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'A confirmação de senha de conter entre 6 e 12 caracteres.';
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

      if (password !== confirmPassword && !this.isLogin) {
        this.formulario.controls['confirmacaoSenha'].setErrors({
          passwordMismatch: true,
        });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.resquestLoading = true;
      this.isLogin ? this.login() : this.register();
    } else {
      this.toastr.warning(
        'Corrija todas as pendências do formulário!',
        'Atenção!'
      );
    }
  }

  register() {
    this.resquestLoading = true;
    const registerModel = new UserModel({
      login: this.usuario,
      password: this.password,
      email: this.email,
    });

    this.authenticationStore
      .register(registerModel)
      .pipe(
        catchError((err) => {
          if (err.status == '409') {
            this.toastr.warning(err.error.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar o cadastro.',
              'Erro'
            );
          }
          this.resquestLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((response) => {});
  }

  login() {
    const authModel = new AuthenticationModel({
      login: this.usuario,
      password: this.password,
    });

    this.authenticationStore
      .login(authModel)
      .pipe(
        catchError((err) => {
          console.log(err);
          if (err.status == '401' || err.status == '404') {
            this.toastr.warning(err.error.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar o login.',
              'Erro'
            );
          }
          this.resquestLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((response) => {});
  }
  get getForm() {
    return this.formulario.controls;
  }
}
