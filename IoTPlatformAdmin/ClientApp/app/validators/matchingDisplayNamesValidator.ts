
import { FormGroup } from '@angular/forms';

export function matchingDisplayNames(displayName: string, confirmDisplayName: string) {
    return (group: FormGroup): { [key: string]: any } => {
        let dispName = group.controls[displayName];
        let confPass = group.controls[confirmDisplayName];

        if (dispName.value !== confPass.value) {
            return {
                mismatchedDisplayNames: true
            };
        }
    }
}
