import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../services/budget';
import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  caricamento = signal<boolean>(false);
  dataCorrente = new Date();

  constructor(public budgetService: BudgetService) {}

  get nomeMeseFormattato(): string {
    const mese = this.dataCorrente.toLocaleString('it-IT', { month: 'long' });
    const anno = this.dataCorrente.getFullYear();
    return `${mese.charAt(0).toUpperCase() + mese.slice(1)} ${anno}`;
  }

  get saldo(): number {
    return this.budgetService.getSaldoMese(
      this.dataCorrente.getFullYear(),
      this.dataCorrente.getMonth() + 1,
    );
  }

  get speseFisse(): number {
    return this.budgetService.getTotaleSpeseFisse(
      this.dataCorrente.getFullYear(),
      this.dataCorrente.getMonth() + 1,
    );
  }

  get speseVariabili(): number {
    return this.budgetService.getTotaleSpeseVariabili(
      this.dataCorrente.getFullYear(),
      this.dataCorrente.getMonth() + 1,
    );
  }

  cambiaMese(delta: number) {
    this.dataCorrente.setMonth(this.dataCorrente.getMonth() + delta);
    this.dataCorrente = new Date(this.dataCorrente);
  }

  elimina(id?: string) {
    if (!id) return;
    this.budgetService.deleteTransaction(id);
  }

  logout() {
    // Gestione eventuale del logout (es. pulizia token/sessione Supabase)
  }
}
