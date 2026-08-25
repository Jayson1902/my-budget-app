import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTransactionModal } from './quick-transaction-modal';

describe('QuickTransactionModal', () => {
  let component: QuickTransactionModal;
  let fixture: ComponentFixture<QuickTransactionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTransactionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTransactionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
