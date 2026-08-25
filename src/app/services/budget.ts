import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  transactions = signal<Transaction[]>([]);

  constructor() {
    this.caricaTransazioni();
  }

  // Carica le transazioni (usato da dashboard.ts)
  caricaTransazioni() {
    this.loadFromLocalStorage();
  }

  // Aggiunge una nuova transazione
  async addTransaction(transactionData: Omit<Transaction, 'id'>) {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };

    this.transactions.update((list) => [newTransaction, ...list]);
    this.saveToLocalStorage();
  }

  // Rimuove una transazione tramite ID
  deleteTransaction(id: string) {
    this.transactions.update((list) => list.filter((t) => t.id !== id));
    this.saveToLocalStorage();
  }

  // Calcola il saldo del mese corrente (Entrate - Uscite)
  getSaldoMese(anno: number, mese: number): number {
    return this.transactions()
      .filter((t) => {
        const [y, m] = t.date.split('-').map(Number);
        return y === anno && m === mese;
      })
      .reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
      }, 0);
  }

  // Calcola il totale delle spese fisse / ricorrenti del mese
  getTotaleSpeseFisse(anno: number, mese: number): number {
    return this.transactions()
      .filter((t) => {
        const [y, m] = t.date.split('-').map(Number);
        return y === anno && m === mese && t.type === 'expense' && t.isRecurring;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }

  // Calcola il totale delle spese variabili del mese
  getTotaleSpeseVariabili(anno: number, mese: number): number {
    return this.transactions()
      .filter((t) => {
        const [y, m] = t.date.split('-').map(Number);
        return y === anno && m === mese && t.type === 'expense' && !t.isRecurring;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }

  // Salvataggio nel LocalStorage
  private saveToLocalStorage() {
    localStorage.setItem('budget_transactions', JSON.stringify(this.transactions()));
  }

  // Caricamento dal LocalStorage
  private loadFromLocalStorage() {
    const data = localStorage.getItem('budget_transactions');
    if (data) {
      try {
        this.transactions.set(JSON.parse(data));
      } catch (e) {
        console.error('Errore nel caricamento delle transazioni dal localStorage', e);
      }
    }
  }
}
