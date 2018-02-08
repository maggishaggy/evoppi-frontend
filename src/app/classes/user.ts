/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

export class User {
  private _authenticated: boolean;
  private _role: string;
  private _login: string;
  private _email: string;
  private _authHeader: string;

  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this._role = user._role;
      this._login = user._login;
      this._email = user._email;
      this._authenticated = user._authenticated;
      this._authHeader = user._authHeader;
    } else {
      this._authenticated = false;
    }
  }

  get authHeader(): string {
    return this._authHeader;
  }

  set authHeader(value: string) {
    this._authHeader = value;
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get login(): string {
    return this._login;
  }

  set login(value: string) {
    this._login = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  public save() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  public clear() {
    localStorage.removeItem('user');
  }
}
