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

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {WorkResult} from '../interfaces/work-result';
import {InteractionService} from '../services/interaction.service';
import {of} from 'rxjs/observable/of';
import {GeneService} from '../services/gene.service';
import {InteractomeService} from '../services/interactome.service';

@Injectable()
export class FakeInteractionService extends InteractionService {

  static RESULT_DIFF: WorkResult = {
    'id': 'cdf4d0c6-4b88-4db5-bf0c-72a03a654711',
    'queryGene': 36454,
    'queryMaxDegree': 1,
    'status': 'COMPLETED',
    'interactions' : {
      'referenceGenes': [
        {
          'geneId': 100,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/100',
          'defaultName': '100'
        },
        {
          'geneId': 101,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/101',
          'defaultName': '101'
        },
        {
          'geneId': 110,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/110',
          'defaultName': '110'
        },
        {
          'geneId': 111,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/111',
          'defaultName': '111'
        },
        {
          'geneId': 120,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/120',
          'defaultName': '120'
        },
        {
          'geneId': 121,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/121',
          'defaultName': '121'
        }
      ],
      'targetGenes': [
        {
          'geneId': 200,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/200',
          'defaultName': '200'
        },
        {
          'geneId': 201,
          'uri': 'http://192.168.0.16:8080/evoppi/rest/api/gene/201',
          'defaultName': '201'
        }
      ],
      'blastResults': [
        {
          'qseqid': 100,
          'qseqversion': 1,
          'sseqid': 200,
          'sseqversion': 6,
          'pident': 48.904,
          'length': 456,
          'mismatch': 207,
          'gapopen': 5,
          'qstart': 475,
          'qend': 920,
          'sstart': 62,
          'send': 501,
          'evalue': '7.45E-131',
          'bitscore': 404.0
        },
        {
          'qseqid': 101,
          'qseqversion': 1,
          'sseqid': 201,
          'sseqversion': 1,
          'pident': 35.118,
          'length': 467,
          'mismatch': 254,
          'gapopen': 12,
          'qstart': 8,
          'qend': 460,
          'sstart': 4,
          'send': 435,
          'evalue': '9.88E-83',
          'bitscore': 263.0
        },
        {
          'qseqid': 120,
          'qseqversion': 1,
          'sseqid': 220,
          'sseqversion': 4,
          'pident': 42.888,
          'length': 457,
          'mismatch': 215,
          'gapopen': 8,
          'qstart': 8,
          'qend': 458,
          'sstart': 17,
          'send': 433,
          'evalue': '1.17E-109',
          'bitscore': 332.0
        },
        {
          'qseqid': 121,
          'qseqversion': 1,
          'sseqid': 221,
          'sseqversion': 2,
          'pident': 37.262,
          'length': 577,
          'mismatch': 307,
          'gapopen': 14,
          'qstart': 68,
          'qend': 618,
          'sstart': 29,
          'send': 576,
          'evalue': '1.91E-112',
          'bitscore': 350.0
        }
      ],
      'interactions': [
        {
          'geneA': 100,
          'geneB': 101,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 1
            }
          ]
        },
        {
          'geneA': 110,
          'geneB': 111,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 1
            }
          ]
        },
        {
          'geneA': 100,
          'geneB': 111,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 1
            }
          ]
        },
        {
          'geneA': 120,
          'geneB': 121,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 1
            }
          ]
        },
        {
          'geneA': 200,
          'geneB': 201,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 2
            }
          ]
        },
        {
          'geneA': 201,
          'geneB': 221,
          'interactomeDegrees': [
            {
              'id': 1,
              'degree': 2
            }
          ]
        }
      ],
    },
    'referenceInteractomes': [
      {
        'id': 1,
        'uri': 'http://192.168.0.16:8080/evoppi/rest/api/interactome/1',
        'species': {
          'id': 1,
          'name': 'Drosophila melanogaster',
          'uri': '',
          'interactomes': [],
        }
      }],
    'targetInteractomes': [
      {
        'id': 2,
        'uri': 'http://192.168.0.16:8080/evoppi/rest/api/interactome/2',
        'species': {
          'id': 2,
          'name': 'Homo sapiens',
          'uri': '',
          'interactomes': [],
        }
      }],
  };

  constructor(protected http: HttpClient, protected geneService: GeneService, protected interactomeService: InteractomeService) {
    super(http, geneService, interactomeService);
  }

  getInteractionResult(uri: string): Observable<WorkResult> {
    if (uri === 'differentSpecies') {
      return of(FakeInteractionService.RESULT_DIFF);
    }
  }

}
