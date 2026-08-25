import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  getSaldoMese(arg0: number, arg1: number, arg2: number): number {
    throw new Error('Method not implemented.');
  }
  getTotaleSpeseFisse(arg0: number, arg1: number): number {
    throw new Error('Method not implemented.');
  }
  getTotaleSpeseVariabili(arg0: number, arg1: number): number {
    throw new Error('Method not implemented.');
  }
  private supabase: SupabaseClient;
  transactions = signal<Transaction[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

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

  async addTransaction(transactionData: Omit<Transaction, 'id'>) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return;

    const newTransaction = {
      ...transactionData,
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

  async deleteTransaction(id: string) {
    const { error } = await this.supabase.from('transactions').delete().eq('id', id);

    if (error) {
      console.error('Errore durante la cancellazione:', error);
    } else {
      this.transactions.update((list) => list.filter((t) => t.id !== id));
    }
  }
}
