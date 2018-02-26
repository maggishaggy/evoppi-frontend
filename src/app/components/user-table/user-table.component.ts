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

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {User} from '../../classes/user';
import {AdminService} from '../../services/admin.service';
import {ResearcherService} from '../../services/researcher.service';
import {DialogComponent} from '../dialog/dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, AfterViewInit {

  @Input() dataSource: MatTableDataSource<User>;
  @Input() displayedColumns: string[];
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor(private adminService: AdminService, private researcherService: ResearcherService, private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  edit(login: string, role: string) {
    this.router.navigateByUrl('/edit-user/' + login + '/' + role);
  }

  delete(login: string, role: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure you want to delete user "' + login + '"?', type: 'YES_NO' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        if (role === 'ADMIN') {
          this.adminService.deleteAdmin(login)
            .subscribe((res) => {
              this.change.emit(role);
            }, (err) => {
              console.log('ERROR', err);
            });
        } else if (role === 'RESEARCHER') {
          this.researcherService.deleteResearcher(login)
            .subscribe((res) => {
              this.change.emit(role);
            }, (err) => {
              console.log('ERROR', err);
            });
        }
      }
    });
  }
}
