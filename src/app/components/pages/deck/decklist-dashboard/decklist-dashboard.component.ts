import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {NewDeckListData, NewDeckListForm} from "../../../../interfaces/forms/decklist-form.interface";
import {FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-decklist-dashboard',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './decklist-dashboard.component.html',
    styleUrl: './decklist-dashboard.component.scss'
})
export class DecklistDashboardComponent {

    private _authService = inject(AuthService);
    private _fb = inject(FormBuilder)

    isLoggedIn = this._authService.isLoggedIn();
    isFormOpen = signal<boolean>(false);

    newDeckListForm: FormGroup<NewDeckListForm> = this._fb.group({
        name: ['', Validators.required],
        main_card_id: [''],
        game_format: [0, Validators.required],
    });

    onSubmit() {
        if (this.newDeckListForm.invalid) return;

        const newDecklistData: NewDeckListData = this.newDeckListForm.getRawValue();

        alert(JSON.stringify(newDecklistData));
    }

    cancelCreation(){
        this.isFormOpen.set(false);
    }

    openCreationForm(){
        this.isFormOpen.set(true);
    }
}
