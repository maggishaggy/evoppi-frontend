/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
    selector: 'app-form-distinct-species',
    templateUrl: './form-distinct-species.component.html',
    styleUrls: ['./form-distinct-species.component.scss']
})
export class FormDistinctSpeciesComponent implements OnInit {

    constructor(private snackBar: MatSnackBar, private router: Router) {
    }

    ngOnInit() {
    }

    showNotification() {
        const snackBar = this.snackBar.open('Different species interactions requested', 'Go to results', {
            duration: 5000
        });
        snackBar.onAction().subscribe(() => {
           this.router.navigateByUrl('/results');
        });
    }
}
