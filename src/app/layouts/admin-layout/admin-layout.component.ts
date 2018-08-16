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

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location, PopStateEvent} from '@angular/common';
import 'rxjs/add/operator/filter';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import {routerTransition} from './router.animations';
import {Navigation} from '../../navigation/navigation.module';
import NavigationInfo = Navigation.NavigationInfo;

const ROUTES = [
    {path: '/dashboard', title: 'Dashboard', showInMenu: true, icon: 'dashboard'},
    {path: '/query', title: 'Query', showInMenu: true, icon: 'search'},
    {path: '/results', title: 'Results', showInMenu: true, icon: 'list'},
    {
        path: '/results/chart/same',
        title: 'Same species results chart',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/chart/distinct',
        title: 'Distinct species results chart',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/table/same',
        title: 'Same species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    },
    {
        path: '/results/table/distinct',
        title: 'Distinct species results table',
        showInMenu: false,
        backRoute: '/results',
        backRouteTitle: 'Go back to Results'
    }
];

@Component({
    selector: 'app-admin-layout',
    animations: [ routerTransition ],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(public location: Location, private router: Router) {
    }

    ngOnInit() {
        if (this.isWindows() && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url !== this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url === this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                elemMainPanel.scrollTop = 0;
                elemSidebar.scrollTop = 0;
            });

        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
        }
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }

    isWindows(): boolean {
        return navigator.platform.indexOf('Win') > -1 ? true : false;
    }

    isMac(): boolean {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0;
    }

    public getState(outlet) {
        return outlet.activatedRouteData.state;
    }

    public get routes(): NavigationInfo[] {
        return ROUTES;
    }

}
