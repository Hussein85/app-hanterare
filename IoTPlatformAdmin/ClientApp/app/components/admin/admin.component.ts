import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';

@Component({
    template: require('./admin.component.html')
})
export class AdminComponent {
    constructor(private auth: AuthService,  private translate: TranslateService) { }
}
