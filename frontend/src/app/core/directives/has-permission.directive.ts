import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authStore = inject(AuthStore);

  private permission = '';
  private elseTemplateRef: TemplateRef<any> | null = null;
  private hasView = false;

  @Input() set appHasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  @Input() set appHasPermissionElse(templateRef: TemplateRef<any> | null) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  constructor() {
    // React to changes in permissions state
    effect(() => {
      // Logic inside effect tracks signals
      const permissions = this.authStore.permissions();
      this.updateView();
    });
  }

  private updateView() {
    const hasPermission = this.authStore.hasPermission(this.permission);

    if (hasPermission && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission) {
      this.viewContainer.clear();
      this.hasView = false;
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
    }
  }
}
