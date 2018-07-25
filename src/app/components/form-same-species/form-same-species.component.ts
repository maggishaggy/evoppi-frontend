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
import {
  MatCheckboxChange, MatDialog, MatPaginator, MatSelectionList, MatSort, MatTab, MatTabChangeEvent,
  MatTableDataSource
} from '@angular/material';
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
import {map, tap} from 'rxjs/operators';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {Location} from '@angular/common';
import {SameSpeciesDataSource} from './same-species-data-source';
import {SortDirection} from '../../enums/sort-direction.enum';
import {OrderField} from '../../enums/order-field.enum';

@Component({
  selector: 'app-form-same-species',
  templateUrl: './form-same-species.component.html',
  styleUrls: ['./form-same-species.component.css']
})
export class FormSameSpeciesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelectionList) geneList: MatSelectionList;
  @ViewChild(MatTab) graphViewTab: MatTab;

  private _work: Work;

  formSameSpecies: FormGroup;
  dataSource: MatTableDataSource<Interaction>;
  paginatedDataSource: SameSpeciesDataSource;
  paginatorLength: number;
  displayedColumns: string[];

  species: Species[];
  interactomes: Interactome[] = [];
  selectedInteractomes: Interactome[] = [];
  interaction: Interaction[] = [];
  resInteractomes: Interactome[] = [];
  genes: GeneInfo[];
  level: number;
  genesInput: string;

  showForm = true;
  showTable = false;
  searchingGenes = false;

  nodes: Node[] = [];
  links: Link[] = [];
  lastQueryMaxDegree: number;

  graphWidth = 900;
  graphHeight = 450;

  csvContent: SafeResourceUrl = '';
  csvName = 'data.csv';

  resultUrl = '';
  paginatedResultUrl = '';
  fullResultAvailable = false;

  permalink: string;
  processing = false;
  collapseInteractomes = false;

  constructor(private speciesService: SpeciesService, private interactomeService: InteractomeService, private domSanitizer: DomSanitizer,
              private geneService: GeneService, private interactionService: InteractionService, private formBuilder: FormBuilder,
              private dialog: MatDialog, private location: Location) {

  }

  ngOnInit() {
    this.level = 1;
    this.genesInput = '';
    this.formSameSpecies = this.formBuilder.group({
      'species': ['', Validators.required],
      'interactomes': ['', Validators.required],
      'gene': ['', Validators.required],
      'level': ['1', [Validators.required, Validators.min(1), Validators.max(3)]],
    });
    this.getSpecies();

    this.resizeGraph();

    this.formSameSpecies.controls.gene.valueChanges.debounceTime(500).subscribe((res) => {
      this.onSearchGenes(res);
    });

    this.paginatedDataSource = new SameSpeciesDataSource(this.interactionService);

  }

  initPaginator() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadCurrentResultsPage())
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadCurrentResultsPage())
      )
      .subscribe();
  }
  loadResultsPage(uri: string, page: number = 0, pageSize: number = 10, sortDirection: SortDirection = SortDirection.ASCENDING,
                  orderField: OrderField = OrderField.GENE_A_ID, interactomeId?: number) {
    this.paginatedDataSource.load(uri, page, pageSize, sortDirection, orderField, interactomeId);
  }

  loadCurrentResultsPage() {
    let sortDirection: SortDirection = SortDirection.NONE;
    if (this.sort.direction === 'desc') {
      sortDirection = SortDirection.DESCENDING;
    } else if (this.sort.direction === 'asc') {
      sortDirection = SortDirection.ASCENDING;
    }

    let orderField: OrderField = OrderField.GENE_A_ID;
    let interactomeId: number;
    if (this.sort.active === 'GeneB') {
      orderField = OrderField.GENE_B_ID;
    } else if (this.sort.active === 'NameB') {
      orderField = OrderField.GENE_B_NAME;
    } else if (this.sort.active === 'NameA') {
      orderField = OrderField.GENE_A_NAME;
    } else if (this.sort.active && this.sort.active.indexOf('-') !== -1) {
      orderField = OrderField.INTERACTOME;
      interactomeId = +this.sort.active.substring(this.sort.active.indexOf('-') + 1);
    }

    this.paginatedDataSource.load(this.paginatedResultUrl, this.paginator.pageIndex, this.paginator.pageSize, sortDirection,
      orderField, interactomeId);
  }

  @Input()
  set work(value: Work) {
    if (value && value.name.startsWith('Same species')) {
      this.showForm = false;
      this.openDialog(value);
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

  selectAllInteractomes(control: string, values) {
    this.formSameSpecies.controls[control].setValue(values);
  }

  deselectAllInteractomes(control: string) {
    this.formSameSpecies.controls[control].setValue([]);
  }

  onChangeSpecies(value: Species): void {
    this.interactomes = [];

    for (const interactome of value.interactomes) {
      this.interactomeService.getInteractome(interactome.id)
        .subscribe(res => {
          this.interactomes.push(res);
        },
          err => {},
          () => {
          this.interactomes.sort((a, b) => a.name < b.name ? -1 : 1);
        });
    }
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
    if (this.processing) {
      return;
    }
    this.fullResultAvailable = false;
    this.processing = true;
    if (this.formSameSpecies.status === 'INVALID') {
      console.log('INVALID');
      return;
    }
    this.showTable = false;
    const formModel = this.formSameSpecies.value;
    this.interactionService.getSameSpeciesInteraction(formModel.gene, formModel.interactomes.map((item) => item.id),
      formModel.level)
      .subscribe((work) => {
        this.permalink = this.location.normalize('/compare?result=' + work.id.id);
        this.openDialog(work);
      }, (error) => {
        this.formSameSpecies.setErrors({'invalidForm': 'Error: ' + error.error});
        this.processing = false;
      });
  }

  private openDialog(data: Work) {
    this.resultUrl = data.resultReference;
    setTimeout(() => {
      const dialogRef = this.dialog.open(WorkStatusComponent, {
        disableClose: true,
        data: {data}
      });

      dialogRef.afterClosed().subscribe(res => {
        if ( res.status === Status.COMPLETED ) {
          this.getResultPaginated(res.resultReference);
        } else {
          alert('Work unfinished');
        }
        this.processing = false;
      });
    });
  }

  private getResultPaginated(uri: string) {
    this.paginatedResultUrl = uri;
    this.interactionService.getInteractionResultSummarized(uri)
      .subscribe((workRes) => {
        this.resInteractomes = workRes.interactomes;
        this.paginatorLength = workRes.totalInteractions;
        this.paginatedDataSource.load(uri);
        this.paginatedDataSource.loading$.subscribe((res) => {
          if (res === false) {
            if (this.collapseInteractomes) {
              this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
            } else {
              this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
                ...workRes.interactomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
            }
            this.showTable = true;
          }
        });
        this.processing = false;
      });
  }

  private getResult(uri: string) {
    this.processing = true;
    this.interactionService.getInteractionResult(uri)
      .subscribe((res) => {
        this.lastQueryMaxDegree = res.queryMaxDegree;
        this.interaction = res.interactions.interactions;
        this.resInteractomes = res.interactomes;

        const nodes = [];
        const links = [];
        const csvData = [];

        const getGene = geneId => res.interactions.genes.find(gene => gene.geneId === geneId);

        for (const interaction of this.interaction) {
          const geneInfoA = getGene(interaction.geneA);
          interaction.firstNameA = geneInfoA.defaultName;

          const geneInfoB = getGene(interaction.geneB);
          interaction.firstNameB = geneInfoB.defaultName;

          const from = new Node(nodes.length, interaction.geneA, interaction.firstNameA);
          let fromIndex = nodes.findIndex(x => x.label === from.label);
          if (fromIndex === -1) {
            fromIndex = nodes.length;
            nodes.push(from);
          } else {
            nodes[fromIndex].linkCount++;
          }

          const to = new Node(nodes.length, interaction.geneB, interaction.firstNameB);
          let toIndex = nodes.findIndex(x => x.label === to.label);
          if (toIndex === -1) {
            toIndex = nodes.length;
            nodes.push(to);
          } else {
            nodes[toIndex].linkCount++;
          }

          let link;

          if (interaction.interactomeDegrees.length === res.interactomes.length) {
            link = new Link(fromIndex, toIndex, 3);
            links.push(link);
          } else if (interaction.interactomeDegrees.length === 1) {
            link = new Link(fromIndex, toIndex, 1);
            links.push(link);
          } else if (interaction.interactomeDegrees.length > 1 && interaction.interactomeDegrees.length < res.interactomes.length) {
            link = new Link(fromIndex, toIndex, 2);
            links.push(link);
          } else {
            console.error('Shouldn\'t happen', interaction.interactomeDegrees);
          }

          const csvRow =
            [
              interaction.geneA, interaction.firstNameA,
              interaction.geneB, interaction.firstNameB,
            ];
          if (this.collapseInteractomes) {
            const degrees = interaction.interactomeDegrees.map(interactomeDegree => interactomeDegree.degree)
              .filter((filterItem, position, self) => self.indexOf(filterItem) === position) // Removes duplicates
              .sort()
              .join(',');

            csvRow.push(degrees);
          } else {
            res.interactomes.forEach((resInteractome) => {
              const index: number = interaction.interactomeDegrees.findIndex((degree) => degree.id === resInteractome.id);
              if (index !== -1) {
                csvRow.push(interaction.interactomeDegrees[index].degree);
              } else {
                csvRow.push('');
              }
            });
          }
          csvData.push(csvRow);

        }

        this.nodes = nodes;
        this.links = links;

        let headers: string[];
        if (this.collapseInteractomes) {
          headers = ['Gene A', 'Name A', 'Gene B', 'Name B', 'Interactomes'];
          this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
        } else {
          headers = ['Gene A', 'Name A', 'Gene B', 'Name B',
            ...res.interactomes.map( resInteractome => resInteractome.name)];
          this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
            ...res.interactomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
        }

        this.csvContent = this.domSanitizer.bypassSecurityTrustResourceUrl(
          CsvHelper.getCSV(headers, csvData)
        );

        const interactomeIds = res.interactomes.map(interactome => interactome.id).join('_');
        const geneData = getGene(res.queryGene);
        let name: string = res.queryGene.toString();
        if (geneData && geneData.names && geneData.names.length > 0 && geneData.names[0].names && geneData.names[0].names.length > 0) {
          name = geneData.names[0].names[0];
        }
        this.csvName = 'interaction_' + name + '_' + interactomeIds + '.csv';

        this.showForm = false;
        this.showTable = true;

        this.dataSource = new MatTableDataSource<Interaction>(this.interaction);
        this.dataSource.sort = undefined;
        this.dataSource.paginator = undefined;
        this.fullResultAvailable = true;

        this.processing = false;
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

  onChangeTab(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Graph view' && !this.fullResultAvailable) {
      this.getResult(this.resultUrl);
    }
  }

  onPrepareCSV() {
    if (!this.processing && !this.fullResultAvailable) {
      this.getResult(this.resultUrl);
    }
  }

  onCollapseInteractomes(event: MatCheckboxChange) {
    this.collapseInteractomes = event.checked;
    if (this.collapseInteractomes) {
      this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB', 'Interactomes'];
    } else {
      this.displayedColumns = ['GeneA', 'NameA', 'GeneB', 'NameB',
        ...this.resInteractomes.map(resInteractome => 'Interactome-' + resInteractome.id.toString())];
    }
  }
}
