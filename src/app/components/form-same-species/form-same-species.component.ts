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

import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import {Species} from '../../interfaces/species';
import {SpeciesService} from '../../services/species.service';
import {InteractomeService} from '../../services/interactome.service';
import {Interactome} from '../../interfaces/interactome';
import {GeneService} from '../../services/gene.service';
import {InteractionService} from '../../services/interaction.service';
import {Interaction} from '../../interfaces/interaction';
import {MatDialog, MatSelectionList, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Link} from '../../classes/link';
import {Node} from '../../classes/node';
import {CsvHelper} from '../../helpers/csv.helper';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {GeneInfo} from '../../interfaces/gene-info';
import {SortHelper} from '../../helpers/sort.helper';
import {WorkStatusComponent} from '../work-status/work-status.component';
import {Work} from '../../interfaces/work';
import {Status} from '../../interfaces/status';
import {map} from 'rxjs/operators';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelectionList) geneList: MatSelectionList;

  private _work: Work;

  formSameSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'ReferenceInteractome', 'TargetInteractome'];

  species: Species[];
  interactomes: Interactome[] = [];
  interactomesA: Interactome[] = [];
  interactomesB: Interactome[] = [];
  interaction: Interaction[] = [];
  genes: GeneInfo[];
  level: number;
  genesInput: string;

  hideTable = true;
  hideForm = false;
  searchingGenes = false;

  nodes: Node[] = [];
  links: Link[] = [];

  graphWidth = 900;
  graphHeight = 450;

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  resultUrl = '';
  referenceInteractome: Interactome;
  targetInteractome: Interactome;

  permalink: string;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder,
              private dialog: MatDialog, private location: Location) {

  }

  ngOnInit() {
    this.level = 1;
    this.genesInput = '';
    this.formSameSpecies = this.formBuilder.group({
      'species': ['', Validators.required],
      'interactomeA': ['', Validators.required],
      'interactomeB': ['', Validators.required],
      'gene': ['', Validators.required],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });
    this.getSpecies();

    this.resizeGraph();

    this.formSameSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
      this.onSearchGenes(res);
    });

  }

  @Input()
  set work(value: Work) {
    if (value && value.name.startsWith('Same species')) {
      this.hideForm = true;
      this.openDialog(value);
      console.log('set work', value);
      this._work = value;
    }
  }
  get work(): Work {
    console.log('get work', this._work);
    return this._work;
  }

  private resizeGraph() {
    if (window.innerWidth > 1024) {
      this.graphWidth = 900;
    } else {
      this.graphWidth = window.innerWidth - 120;
    }
    this.graphHeight = this.graphWidth / 2;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeGraph();
  }

  getSpecies(): void {
    this.speciesService.getSpecies()
      .pipe(
        map( species => {
          return species.filter( (specie: Species) => specie.interactomes.length > 1);
        })
      )
      .subscribe(species => this.species = species);
  }

  onChangeForm(): void {
    this.csvContent = '';
  }

  onChangeSpecies(value: Species): void {
    this.interactomes = [];
    this.interactomesA = [];
    this.interactomesB = [];

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => {
          this.interactomes.push(res);
          this.interactomesA.push(res);
          this.interactomesB.push(res);
        });
    }
  }

  onSelectInteractomeA(value: Interactome): void {
    this.interactomesB = this.interactomes.slice();
    const index: number = this.interactomesB.indexOf(value);
    this.interactomesB.splice(index, 1);
  }

  onSelectInteractomeB(value: Interactome): void {
    this.interactomesA = this.interactomes.slice();
    const index: number = this.interactomesA.indexOf(value);
    this.interactomesA.splice(index, 1);
  }

  onSearchGenes(value: string): void {
    let interactomes = [];
    if (value === '') {
      this.genes = [];
      return;
    }
    this.searchingGenes = true;
    if (this.interactomes.length > 0) {
      interactomes = this.interactomes.map((interactome) => interactome.id);
    }
    this.geneService.getGeneName(value, interactomes)
      .subscribe(res => {
        this.genes = res;
        this.searchingGenes = false;
      });

  }
  onCompare(): void {
    if (this.formSameSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    this.hideTable = true;
    const formModel = this.formSameSpecies.value;
    this.interactionService.getSameSpeciesInteraction(formModel.gene, [formModel.interactomeA.id, formModel.interactomeB.id],
      formModel.level)
      .subscribe((work) => {
        this.permalink = this.location.normalize('/compare?result=' + work.id.id);
        this.openDialog(work);
      });
  }

  private openDialog(data: Work) {
    this.resultUrl = data.resultReference;
    const dialogRef = this.dialog.open(WorkStatusComponent, {
      disableClose: true,
      data: {data}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res.resultReference);
      if ( res.status === Status.COMPLETED ) {
        this.getResult(res.resultReference);
      } else {
        alert('Work unfinished');
      }
    });
  }

  private getResult(uri: string) {
    const formModel = this.formSameSpecies.value;
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {

        this.geneService.getGeneNames(res.genes)
          .subscribe((geneNames) => {

            this.interaction = res.interactions;
            this.referenceInteractome = res.interactomes[0];
            this.targetInteractome = res.interactomes[1];

            const nodes = [];
            const links = [];
            const csvData = [];

            for (const item of this.interaction) {
              const geneInfoA = geneNames.find(x => x.geneId === item.geneA);
              item.firstNameA = GeneService.getFirstName(geneInfoA);
              const geneInfoB = geneNames.find(x => x.geneId === item.geneB);
              item.firstNameB = GeneService.getFirstName(geneInfoB);

              const from = new Node(nodes.length, item.geneA, item.firstNameB);
              let fromIndex = nodes.findIndex(x => x.label === from.label);
              if (fromIndex === -1) {
                fromIndex = nodes.length;
                nodes.push(from);
              } else {
                nodes[fromIndex].linkCount++;
              }

              const to = new Node(nodes.length, item.geneB, item.firstNameB);
              let toIndex = nodes.findIndex(x => x.label === to.label);
              if (toIndex === -1) {
                toIndex = nodes.length;
                nodes.push(to);
              } else {
                nodes[toIndex].linkCount++;
              }

              let referenceDegree: number | string = '';
              let targetDegree: number | string = '';
              let link;
              if (item.interactomeDegrees.length === 2) {
                link = new Link(fromIndex, toIndex, 3);
                links.push(link);
                if (item.interactomeDegrees[0].id === this.referenceInteractome.id) {
                  referenceDegree = item.interactomeDegrees[0].degree;
                  targetDegree = item.interactomeDegrees[1].degree;
                } else {
                  referenceDegree = item.interactomeDegrees[1].degree;
                  targetDegree = item.interactomeDegrees[0].degree;
                }
              } else if (item.interactomeDegrees.length === 1) {
                if (item.interactomeDegrees[0].id === this.referenceInteractome.id) {
                  link = new Link(fromIndex, toIndex, 1);
                  referenceDegree = item.interactomeDegrees[0].degree;
                } else if (item.interactomeDegrees[0].id === this.targetInteractome.id) {
                  link = new Link(fromIndex, toIndex, 2);
                  targetDegree = item.interactomeDegrees[0].degree;
                } else {
                  console.error('Shouldn\'t happen');
                }
                links.push(link);
              } else {
                console.error('Shouldn\'t happen either');
              }

              csvData.push([item.geneA, item.firstNameA, item.geneB, item.firstNameB, referenceDegree, targetDegree]);
            }

            this.nodes = nodes;
            this.links = links;

            this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
              CsvHelper.getCSV(['Gene A', 'Name A', 'Gene B', 'Name B',
                this.referenceInteractome.name, this.targetInteractome.name], csvData)
            );
            this.csvName = 'interaction_' + formModel.gene + '_' + formModel.interactomeA.id + '_' + formModel.interactomeB.id + '.csv';

            this.hideTable = false;
            this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
            this.dataSource.sort = undefined;
            this.dataSource.paginator = undefined;
          });
      });
  }

  public initTable() {
    if (this.dataSource.sort) {
      return;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = SortHelper.sortInteraction;
    this.dataSource.paginator = this.paginator;
  }

  public onGeneSelected(value) {
    this.genesInput = value;
    this.formSameSpecies.patchValue({gene: value}, {emitEvent: false});
    this.genes = [];
  }

  public exportFasta(id: number) {

  }

  onClickGene(id: number) {
    console.log(id);

    const dialogRef = this.dialog.open(GeneInfoComponent, {
      // width: '250px',
      maxHeight: window.innerHeight,
      data: { geneId: id, blastResults: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}
