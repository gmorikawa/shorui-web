import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AttributeService } from '@services';
import { Attribute } from '@app/attribute/types/models';
import { AttributeCard } from '@app/attribute/components/attribute-card/attribute-card';
import { Stack } from '@components/stack/stack';
import { BaseButtonDirective } from '@directives/base-button/base-button';
import { FeedbackService } from 'services/feedback';

@Component({
  selector: 'sh-attribute-list-page',
  imports: [
    Stack,
    AttributeCard,
    BaseButtonDirective,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class AttributeListPage implements OnInit {
  private readonly attribute = inject(AttributeService);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackService);

  protected attributes = signal<Attribute[]>([]);

  public ngOnInit(): void {
    this.attribute
      .getAll()
      .subscribe({
        next: (attributes) => {
          this.attributes.set(attributes);
        },
        error: () => {
          this.feedback.showErrorMessage('Unable to load attributes. Please try again.');
        },
      });
  }

  protected navigateToForm(attribute?: Attribute): void {
    if (attribute) {
      this.router.navigate(['/app/attributes/form', attribute.key]);
    } else {
      this.router.navigate(['/app/attributes/form']);
    }
  }
}
