import { Component, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BudgetService } from '../services/budget';
import { AuthService } from '../services/auth';
import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionForm, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  caricamento = signal<boolean>(false);
  dataCorrente = new Date();

  constructor(
    public budgetService: BudgetService,
    private authService: AuthService,
    private router: Router,
  ) {}

  get nomeMeseFormattato(): string {
    const mese = this.dataCorrente.toLocaleString('it-IT', { month: 'long' });
    const anno = this.dataCorrente.getFullYear();
    return `${mese.charAt(0).toUpperCase() + mese.slice(1)} ${anno}`;
  }

  get saldo(): number {
    return this.budgetService.getSaldoMese(
      this.dataCorrente.getFullYear(),
      this.dataCorrente.getMonth() + 1,
      0,
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
    this.caricamento.set(true);
    this.dataCorrente.setMonth(this.dataCorrente.getMonth() + delta);
    this.dataCorrente = new Date(this.dataCorrente);
    this.caricamento.set(false);
  }

  elimina(id: string) {
    if (!id) return;
    this.budgetService.deleteTransaction(id);
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
      this.router.navigate(['/login']);
    }
  }
}
