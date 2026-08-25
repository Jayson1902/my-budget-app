import { Component, signal, OnInit, inject } from '@angular/core';
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
export class Dashboard implements OnInit {
  // Uso di inject() per una Dependency Injection moderna
  public budgetService = inject(BudgetService);
  private authService = inject(AuthService);
  private router = inject(Router);

  caricamento = signal<boolean>(false);
  dataCorrente = signal<Date>(new Date()); // Trasformato in segnale per reattività ottimale

  ngOnInit() {
    this.budgetService.caricaTransazioni();
  }

  get nomeMeseFormattato(): string {
    const data = this.dataCorrente();
    const mese = data.toLocaleString('it-IT', { month: 'long' });
    const anno = data.getFullYear();
    return `${mese.charAt(0).toUpperCase() + mese.slice(1)} ${anno}`;
  }

  get saldo(): number {
    const data = this.dataCorrente();
    return this.budgetService.getSaldoMese(data.getFullYear(), data.getMonth() + 1);
  }

  get speseFisse(): number {
    const data = this.dataCorrente();
    return this.budgetService.getTotaleSpeseFisse(data.getFullYear(), data.getMonth() + 1);
  }

  get speseVariabili(): number {
    const data = this.dataCorrente();
    return this.budgetService.getTotaleSpeseVariabili(data.getFullYear(), data.getMonth() + 1);
  }

  cambiaMese(delta: number) {
    this.caricamento.set(true);

    // Aggiorniamo il segnale della data creando una nuova istanza
    const nuovaData = new Date(this.dataCorrente());
    nuovaData.setMonth(nuovaData.getMonth() + delta);
    this.dataCorrente.set(nuovaData);

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
