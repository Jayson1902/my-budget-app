import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  private budgetService = inject(BudgetService);

  tipo: 'income' | 'expense' = 'expense';
  titolo: string = '';
  importo: number | null = null;
  categoria: string = '';
  data: string = new Date().toISOString().substring(0, 10);
  isRicorrente: boolean = false;

  async onSubmit() {
    if (!this.titolo || !this.importo || !this.categoria || !this.data) {
      return;
    }

    await this.budgetService.addTransaction({
      title: this.titolo,
      amount: this.importo,
      type: this.tipo,
      category: this.categoria,
      date: this.data,
      isRecurring: this.isRicorrente,
    });

    // Reset del form
    this.titolo = '';
    this.importo = null;
    this.categoria = '';
    this.data = new Date().toISOString().substring(0, 10);
    this.isRicorrente = false;
  }
}
