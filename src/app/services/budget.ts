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
    this.caricaTransazioni();
  }

  // 1. Carica le transazioni dell'utente loggato da Supabase
  async caricaTransazioni() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id); // Prende solo le transazioni dell'utente corrente

    if (error) {
      console.error('Errore nel caricamento da Supabase:', error);
    } else if (data) {
      this.transactions.set(data as Transaction[]);
    }
  }

  // 2. Aggiunge una nuova transazione su Supabase
  async addTransaction(transactionData: Omit<Transaction, 'id'>) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      console.error('Utente non autenticato!');
      return;
    }

    const newTransaction = {
      ...transactionData,
      user_id: user.id, // Fondamentale per la policy RLS che hai impostato
    };

    const { data, error } = await this.supabase
      .from('transactions')
      .insert([newTransaction])
      .select();

    if (error) {
      console.error("Errore nell'inserimento:", error);
    } else if (data) {
      // Aggiorna la lista locale con i dati tornati dal database
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
}
