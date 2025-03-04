import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrelloSettingsModel } from 'src/app/models/trello-settings.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TrelloBoardModel } from 'src/app/models/trello-board.model';
import { TrelloIntegrationStore } from 'src/app/services/stores/integrations-trello.store';
import {
  getScrumTrelloArray,
  getScrumTrelloEnumByDescription,
  ScrumTrelloEnum,
} from 'src/app/models/enums/scrum-trello.enum';
import { environment } from 'src/environments/environment';
import { TrelloListModel } from 'src/app/models/trello-list.model';
import { TrelloMappingModel } from 'src/app/models/trello-mapping.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-settings-trello-sync',
  templateUrl: './settings-sync-trello.component.html',
  styleUrls: ['./settings-sync-trello.component.scss'],
})
export class SettingsSyncTrelloComponent implements OnInit {
  apiAuthForm!: FormGroup;
  boardForm!: FormGroup;
  trelloModel!: TrelloSettingsModel;
  boardsUser!: TrelloBoardModel[];
  listsInBoard!: TrelloListModel[];
  urlGenerateToken!: string;
  requestLoading: boolean = false;
  currentStep: number = 1;
  selectedBoard = '';
  tableColumns: string[] = ['referent', 'nameListTrello', 'action'];
  scrumTrelloList!: string[];
  selectedReferent!: string;
  selectedListId!: string;

  trelloMappings: TrelloMappingModel[] = [];

  dataSource = new MatTableDataSource<TrelloMappingModel>(this.trelloMappings);

  get getFormAuth() {
    return this.apiAuthForm.controls;
  }

  get getFormBoards() {
    return this.boardForm.controls;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private trelloIntegrationStore: TrelloIntegrationStore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.urlGenerateToken = environment.urlGetTokenTrello;
    this.scrumTrelloList = getScrumTrelloArray();
    this._initFormApiAuth();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getByUser();
    });
  }

  private _initFormApiAuth() {
    this.apiAuthForm = this.fb.group({
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
      boardId: new FormControl('', Validators.required),
    });
  }

  private _checkStages() {
    if (this.trelloModel.boardId && this.trelloModel.token) {
      this.currentStep = 3;
      this.getListsByBoard();
    } else if (!this.trelloModel.boardId && this.trelloModel.token) {
      this.currentStep = 2;
      this.getBoards();
    } else if (!this.trelloModel.token) {
      this.currentStep = 1;
    }
  }

  addPair() {
    if (!this.selectedReferent || !this.selectedListId) {
      return;
    }

    const selectedList = this.listsInBoard.find(
      (list) => list.id === this.selectedListId
    );
    if (!selectedList) {
      return;
    }

    const exists = this.trelloMappings.some(
      (mapping) =>
        mapping.referent === this.selectedReferent &&
        mapping.listId === this.selectedListId
    );
    if (exists) {
      return;
    }

    this.trelloMappings.push({
      referent: this.selectedReferent,
      listId: selectedList.id,
      listName: selectedList.name,
      trelloSettingId: this.trelloModel.id,
    });

    this.dataSource.data = [...this.trelloMappings];

    this.scrumTrelloList = this.scrumTrelloList.filter(
      (item) => item !== this.selectedReferent
    );
    this.listsInBoard = this.listsInBoard.filter(
      (item) => item.id !== this.selectedListId
    );
    this.selectedReferent = '';
    this.selectedListId = '';
  }

  removePair(index: number) {
    const removedPair = this.trelloMappings[index];

    if (removedPair) {
      if (!this.scrumTrelloList.includes(removedPair.referent)) {
        this.scrumTrelloList.push(removedPair.referent);
      }

      const alreadyExists = this.listsInBoard.some(
        (list) => list.id === removedPair.listId
      );
      if (!alreadyExists) {
        this.listsInBoard.push({
          id: removedPair.listId,
          name: removedPair.listName,
        });
      }

      this.trelloMappings.splice(index, 1);

      this.dataSource.data = [...this.trelloMappings];
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
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

  private _ajustModel() {
    if (!this.trelloModel)
      this.trelloModel = new TrelloSettingsModel({
        token: this.apiAuthForm.get('token')?.value,
      });
    this.trelloModel.token = this.apiAuthForm.get('token')?.value;
    this.trelloModel.boardId = this.boardForm.get('boardId')?.value;
  }

  saveSettings() {
    this.requestLoading = true;
    this._ajustModel();
    this.trelloIntegrationStore
      .save(this.trelloModel)
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
        this.nextStep();
        this.toastr.info('Credenciais cadastradas e vinculadas ao usuário.');
      });
  }

  getByUser() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .getById()
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
        this.boardForm.patchValue(this.trelloModel);
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
              'Ocorreu um erro interno ao tentar realizar a busca dos quadros no Trello.',
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

  getListsByBoard() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .getListsByBoard(this.trelloModel.boardId)
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar a busca das listas no Trello.',
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
        this.listsInBoard = response;
        this.getMappingsBySettingsId();
      });
  }

  saveMappings() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .saveMappings(this.trelloMappings)
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar o cadastro dos mapeamentos do Trello.',
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
        this.navigateToHome();
        this.toastr.info('Integração configurada com sucesso.');
      });
  }

  getMappingsBySettingsId() {
    this.requestLoading = true;
    this.trelloIntegrationStore
      .getMappingsBySettingId(this.trelloModel.id)
      .pipe(
        catchError((err) => {
          if (err.message) {
            this.toastr.warning(err.message, 'Atenção!');
          } else {
            this.toastr.error(
              'Ocorreu um erro interno ao tentar realizar a busca dos mapeamentos do Trello.',
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
        this.trelloMappings = response;
        this.dataSource.data = [...this.trelloMappings];
        this.scrumTrelloList = this.scrumTrelloList.filter(
          (referent) =>
            !this.trelloMappings.some(
              (mapping) => mapping.referent === referent
            )
        );

        this.listsInBoard = this.listsInBoard.filter(
          (list) =>
            !this.trelloMappings.some((mapping) => mapping.listId === list.id)
        );
        this.dataSource.data = [...this.trelloMappings];
      });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.getDataByStep();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.getDataByStep();
    }
  }

  getDataByStep(): void {
    if (this.currentStep === 2) {
      this.getBoards();
    } else if (this.currentStep === 3) {
      this.getListsByBoard();
    }
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }
}
