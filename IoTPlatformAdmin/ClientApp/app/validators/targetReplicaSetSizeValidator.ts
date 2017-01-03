import { FormGroup } from '@angular/forms';

export function targetReplicaSetSizeValidator(minReplicaSetSize, targetReplicaSetSize) {
    return (group: FormGroup): { [key: string]: any } => {
        let minReplica = group.controls[minReplicaSetSize];
        let targetReplica = group.controls[targetReplicaSetSize];

     
        if (minReplica.value > targetReplica.value) {
            return {
                invalidTargetReplicaSetSize: true
            };
        }
    }
}
