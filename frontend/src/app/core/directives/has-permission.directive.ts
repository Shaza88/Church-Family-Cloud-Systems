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
  private isVisible = false;

  @Input() set appHasPermission(permission: string) {
    this.permission = permission;
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
    // We need to re-check whenever inputs or store permissions change
    const hasPermission = this.authStore.hasPermission(this.permission);

    if (hasPermission && !this.isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isVisible = true;
    } else if (!hasPermission && this.isVisible) {
      this.viewContainer.clear();
      this.isVisible = false;
    }
  }
}
