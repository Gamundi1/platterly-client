import { Component, input, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type InputType = string | number | Date | boolean | null;

@Component({
  selector: 'shared-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatFormFieldModule, MatInputModule, FormField, MatError],
})
export class InputComponent {
  field = input.required<FieldTree<InputType, string>>();
  label = input.required<string>();
  placeHolder = input.required<string>();
  errorMessage = input('');
  type = input('text');
  inputId: string;
  static idCounter = 0;

  static generateId() {
    return `input-${this.idCounter++}`;
  }

  constructor() {
    this.inputId = InputComponent.generateId();
  }
}
