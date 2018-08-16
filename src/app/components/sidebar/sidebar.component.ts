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

import {Component, Input, OnInit} from '@angular/core';
import {Components} from '../entities/RouteInfo';
import RouteInfo = Components.RouteInfo;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    @Input() public routes: RouteInfo[];

    private filteredRoutes: RouteInfo[];

    constructor() {
    }

    ngOnInit() {
        this.filteredRoutes = this.routes.filter(route => route.showInMenu);
    }

    public get menuItems(): RouteInfo[] {
        return this.filteredRoutes;
    }

    isMobileMenu() {
        return window.screen.width <= 991;
    };
}
