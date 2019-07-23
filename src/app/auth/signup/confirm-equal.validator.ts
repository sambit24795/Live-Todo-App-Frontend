import {
  Validator,
  NG_VALIDATORS,
  AbstractControl,
  ValidatorFn,
  ValidationErrors
} from "@angular/forms";
import { Directive, Input } from "@angular/core";
import { Subscription } from "rxjs";

export function compareValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlCompare = control.root.get(controlName);
    if (controlCompare) {
      const subscription: Subscription = controlCompare.valueChanges.subscribe(
        () => {
          control.updateValueAndValidity();
          subscription.unsubscribe();
        }
      );
    }

    return controlCompare && controlCompare.value !== control.value
      ? { appConfirmEqualValidator: true }
      : null;
  };
}
