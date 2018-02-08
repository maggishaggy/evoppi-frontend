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

import { TestBed, inject } from '@angular/core/testing';

import { SpeciesService } from './species.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Species} from '../interfaces/species';
import {Observable} from 'rxjs/Observable';

export const SPECIES: Species[] = [
  {id: 1, name: 'Homo Sapiens', interactomes: []}
];

describe('SpeciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeciesService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([SpeciesService], (service: SpeciesService) => {
    expect(service).toBeTruthy();
  }));

  it('should be instance of SpeciesService', inject([SpeciesService], (service: SpeciesService) => {
    expect(service instanceof SpeciesService).toBeTruthy();
  }));

  it('can instantiate service with "new"', inject([HttpClient], (http: HttpClient) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new SpeciesService(http);
    expect(service instanceof SpeciesService).toBe(true, 'new service should be ok');
  }));

  it('can call getSpecies', inject([SpeciesService], (service: SpeciesService) => {
    spyOn(service, 'getSpecies').and.returnValue(Observable.of(SPECIES));
    service.getSpecies().subscribe((species) => {
      expect(species instanceof Array).toBeTruthy();
      expect(species.length).toBe(1);
      expect(species[0].name).toBe('Homo Sapiens');
    });
    expect(service.getSpecies).toHaveBeenCalled();
  }));
});
