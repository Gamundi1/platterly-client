import { Component, input, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'shared-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatFormFieldModule, MatInputModule, FormField, MatError],
})
export class InputComponent {
  field = input.required<FieldTree<string, string>>();
  errorMessage = input('');
  type = input('text');
  label = input('');
}
