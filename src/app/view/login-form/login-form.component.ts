import { AuthenticationService } from './../../services/authentication.service';
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
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  isLogin: boolean = true;
  resquestLoading: boolean = false;

  form!: FormGroup;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private toastr: ToastrService,
    private authenticationStore: AuthenticationStore,
    private authenticationService: AuthenticationService
  ) {
    this.createFormGroup();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background =
      'linear-gradient(to bottom, #024a92, #032b7c)';
  }

  createFormGroup() {
    this.form = new FormGroup({
      user: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
    });
    if (!this.isLogin) {
      this.form.addControl(
        'email',
        new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(90),
        ])
      );
      this.form.addControl(
        'passwordConfirmation',
        new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ])
      );
      this.form.addValidators(
        this.passwordMatchValidator('password', 'passwordConfirmation')
      );
    }
  }

  changeIsLogin() {
    this.isLogin = !this.isLogin;
    this.createFormGroup();
  }

  getErrorMessageEmail() {
    let control = this.form.controls['email'];
    if (control.hasError('required')) {
      return 'É necessário informar um email.';
    } else if (control.hasError('maxlength')) {
      return 'O email deve conter até 90 caracteres.';
    }
    return control.hasError('email') ? 'Email inválido.' : '';
  }

  getErrorMessageUser() {
    let control = this.form.controls['user'];
    if (control.hasError('required')) {
      return 'É necessário informar um usuário.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'O usuário deve conter entre 4 e 40 caracteres.';
    }
    return;
  }

  getErrorMessagePassword() {
    let control = this.form.controls['password'];
    if (control.hasError('required')) {
      return 'É necessário informar uma senha.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'A senha deve conter entre 6 e 12 caracteres.';
    }
    return;
  }

  getErrorPasswordConfirmation() {
    let control = this.form.controls['passwordConfirmation'];
    if (control.hasError('passwordMismatch')) {
      return 'As senhas não coincidem.';
    } else if (
      control.hasError('required') &&
      this.form.controls['password'].valid
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
        this.form.controls['passwordConfirmation'].setErrors({
          passwordMismatch: true,
        });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.form.valid) {
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
      login: this.form.get('user')?.value,
      password: this.form.get('password')?.value,
      email: this.form.get('email')?.value,
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
      .subscribe((response) => {
        this.toastr.info('Usuário cadastrado, seja bem-vindo(a).');
        this.login();
      });
  }

  login() {
    const authModel = new AuthenticationModel({
      login: this.form.get('user')?.value,
      password: this.form.get('password')?.value,
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
      .subscribe((response) => {
        this.authenticationService.saveLogin(response.token);
        this.router.navigate(['']);
      });
  }

  get getForm() {
    return this.form.controls;
  }
}
