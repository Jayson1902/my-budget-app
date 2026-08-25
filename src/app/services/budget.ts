import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private supabase: SupabaseClient;
  transactions = signal<Transaction[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // 1. Carica le transazioni dell'utente loggato da Supabase
  async caricaTransazioni() {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await this.supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Errore nel caricamento da Supabase:', error);
      } else if (data) {
        this.transactions.set(data as Transaction[]);
      }
    } catch (err) {
      console.error('Errore di connessione a Supabase:', err);
    }
  }

  // 2. Aggiunge una nuova transazione su Supabase
  async addTransaction(transactionData: any) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) {
      console.error('Utente non autenticato!');
      return;
    }

    const newTransaction = {
      title: transactionData.title,
      amount: transactionData.amount,
      category: transactionData.category,
      date: transactionData.date,
      type: transactionData.type,
      user_id: user.id,
    };

    const { data, error } = await this.supabase
      .from('transactions')
      .insert([newTransaction])
      .select();

    if (error) {
      console.error("Errore nell'inserimento:", error);
    } else if (data) {
      this.transactions.update((list) => [...(data as Transaction[]), ...list]);
    }
  }

  // 3. Rimuove una transazione tramite ID da Supabase
  async deleteTransaction(id: string) {
    const { error } = await this.supabase.from('transactions').delete().eq('id', id);

    if (error) {
      console.error('Errore durante la cancellazione:', error);
    } else {
      this.transactions.update((list) => list.filter((t) => t.id !== id));
    }
  }

  // 4. Metodi di calcolo per il saldo e le spese nella dashboard
  getSaldoMese(anno: number, mese: number): number {
    const transazioniMese = this.transactions().filter((t) => {
      const dataTransazione = new Date(t.date);
      return dataTransazione.getFullYear() === anno && dataTransazione.getMonth() + 1 === mese;
    });

    return transazioniMese.reduce((acc, t) => {
      const importo = Number(t.amount);
      return t.type === 'income' ? acc + importo : acc - importo;
    }, 0);
  }

  getTotaleSpeseFisse(anno: number, mese: number): number {
    return this.transactions()
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === anno && d.getMonth() + 1 === mese && t.type === 'expense';
      })
      .reduce((acc, t) => acc + Number(t.amount), 0);
  }

  getTotaleSpeseVariabili(anno: number, mese: number): number {
    return 0;
  }
}
