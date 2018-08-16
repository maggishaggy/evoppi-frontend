/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InteractomeListComponent} from './interactome-list/interactome-list.component';
import {SpeciesListComponent} from './species-list/species-list.component';
import {AutocompleteComponent} from './autocomplete/autocomplete.component';
import {MaterialDesignModule} from '../material-design/material-design.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialDesignModule
    ],
    declarations: [
        InteractomeListComponent,
        SpeciesListComponent,
        AutocompleteComponent
    ],
    exports: [
        InteractomeListComponent,
        SpeciesListComponent,
        AutocompleteComponent
    ]
})
export class DataModule {
}
