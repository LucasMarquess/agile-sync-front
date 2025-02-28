import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IntegrationsSettingsStore } from 'src/app/services/stores/integrations-settings.store';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TrelloBoardModel } from 'src/app/models/trello-settings.model copy';
import { TrelloIntegrationStore } from 'src/app/services/stores/integrations-trello.store';

@Component({
  selector: 'app-settings-trello-sync',
  templateUrl: './settings-sync-trello.component.html',
  styleUrls: ['./settings-sync-trello.component.scss'],
})
export class SettingsSyncTrelloComponent implements OnInit {
  trelloModel!: TrelloSettingsModel;
  apiAuthForm!: FormGroup;
  boardForm!: FormGroup;
  requestLoading: boolean = false;
  //TODO: Implementar lógica para controle de etapas
  firstStepCompleted: boolean = false;
  secondStepCompleted: boolean = false;
  thirdStepCompleted: boolean = false;
  boardsUser!: TrelloBoardModel[];
  selectedBoard = '';

  get getFormAuth() {
    return this.apiAuthForm.controls;
  }

  get getFormBoards() {
    return this.boardForm.controls;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private IntegrationsSettingsStore: IntegrationsSettingsStore,
    private trelloIntegrationStore: TrelloIntegrationStore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this._initFormApiAuth();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getByUser();
    });
  }

  private _initFormApiAuth() {
    this.apiAuthForm = this.fb.group({
      key: [
        '',
        [
          Validators.required,
          Validators.minLength(32),
          Validators.maxLength(255),
        ],
      ],
      token: [
        '',
        [
          Validators.required,
          Validators.minLength(64),
          Validators.maxLength(255),
        ],
      ],
    });

    this.boardForm = new FormGroup({
      board: new FormControl('', Validators.required),
    });
  }

  private _checkStages() {
    this.firstStepCompleted = !!(
      this.trelloModel.key && this.trelloModel.token
    );
    this.secondStepCompleted =
      this.firstStepCompleted && !!this.trelloModel.boardId;
    this.thirdStepCompleted =
      this.secondStepCompleted && !!this.trelloModel.cardMappingName;

    if (this.firstStepCompleted) {
      this.getBoards();
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  getErrorMessageKey() {
    let control = this.apiAuthForm.controls['key'];
    if (control.hasError('required')) {
      return 'A chave é obrigatória.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'A chave deve conter de 32 a 255 caracteres.';
    }
    return;
  }

  getErrorMessageToken() {
    let control = this.apiAuthForm.controls['token'];
    if (control.hasError('required')) {
      return 'O token é obrigatório.';
    } else if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'O token deve conter de 64 a 255 caracteres.';
    }
    return;
  }

  saveSettings() {
    this.requestLoading = true;
    this.IntegrationsSettingsStore.save(this.apiAuthForm.getRawValue())
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar o cadastro das credenciais para integração com o Trello.',
              'Erro'
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe(() => {
        this.toastr.info('Credenciais cadastradas e vinculadas ao usuário.');
      });
  }

  getByUser() {
    this.requestLoading = true;
    this.IntegrationsSettingsStore.getById()
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar a busca das credenciais para integração com o Trello.',
              'Erro'
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe((response) => {
        this.trelloModel = response;
        this.apiAuthForm.patchValue(this.trelloModel);
        this._checkStages();
      });
  }

  getBoards() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .getBoardsUser()
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar a busca dos boards Trello.',
              'Erro'
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.requestLoading = false;
        })
      )
      .subscribe((response) => {
        this.boardsUser = response;
      });
  }

  returnPreviousStep() {}
}
