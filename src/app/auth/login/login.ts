import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  modalitaRegistrazione = signal(false);
  errore = signal<string | null>(null);
  caricamento = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleModalita() {
    this.modalitaRegistrazione.update((v) => !v);
    this.errore.set(null);
  }

  async invia() {
    this.errore.set(null);
    this.caricamento.set(true);

    try {
      if (this.modalitaRegistrazione()) {
        await this.authService.signUp(this.email, this.password);
        this.errore.set('Registrazione avvenuta! Controlla la tua email per confermare.');
      } else {
        await this.authService.signIn(this.email, this.password);
        this.router.navigate(['/']);
      }
    } catch (e: any) {
      this.errore.set(e.message ?? 'Errore sconosciuto');
    } finally {
      this.caricamento.set(false);
    }
  }
}
