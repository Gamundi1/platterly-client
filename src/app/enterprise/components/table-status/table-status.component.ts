import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKitchenSet, faRestroom, faUser } from '@fortawesome/free-solid-svg-icons';
import { Table, TableStatus } from '../../../new-bookings/interfaces/table.interface';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { delay, tap } from 'rxjs';

@Component({
  selector: 'booking-status-table',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FaIconComponent],
  host: {
    '(keydown)': 'keyboardInteraction($event)',
  },
})
export class TableStatusComponent implements OnInit {
  public tables = signal<Table[] | []>([]);

  private readonly httpHandlerService = inject(HttpHandlerService);

  tableUpdated = signal(false);

  focusedTable = signal<Table | null>(null);

  protected faToilet = faRestroom;
  protected faKitchen = faKitchenSet;
  protected faUser = faUser;

  ngOnInit(): void {
    this.getTables();
  }

  protected readonly minInlinePosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.min(...tables.map((table) => table.inlinePosition!)) : 1;
  });

  protected readonly maxInlinePosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.max(...tables.map((table) => table.inlinePosition!)) : 1;
  });

  protected readonly minBlockPosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.min(...tables.map((table) => table.blockPosition!)) : 1;
  });

  protected readonly maxBlockPosition = computed(() => {
    const tables = this.tables();

    return tables.length ? Math.max(...tables.map((table) => table.blockPosition!)) : 1;
  });

  protected readonly tableRows = computed(() => {
    const tables = this.tables();

    return Array.from({ length: this.blockTrackCount() }, (_, index) => {
      const row = index + 1;

      return {
        row,
        tables: tables
          .filter((table) => this.getBlockTrack(table) === row)
          .sort((a, b) => this.getInlineTrack(a) - this.getInlineTrack(b)),
      };
    });
  });

  protected readonly inlineTrackCount = computed(
    () => this.maxInlinePosition() - this.minInlinePosition() + 1,
  );

  protected readonly blockTrackCount = computed(
    () => this.maxBlockPosition() - this.minBlockPosition() + 1,
  );

  private tableButtons = viewChildren<ElementRef<HTMLButtonElement>>('tableButton');

  protected getInlineTrack(table: Table): number {
    return table.inlinePosition! - this.minInlinePosition() + 1;
  }

  protected getBlockTrack(table: Table): number {
    return table.blockPosition! - this.minBlockPosition() + 1;
  }

  protected onTableClick(table: Table): void {
    this.focusedTable.set(table);
    this.httpHandlerService
      .putRequest(UrlProvider.cleanTable, { tableNumber: table.number })
      .pipe(
        tap(() => {
          this.tableUpdated.set(true);
          this.getTables();
        }),
        delay(5000),
        tap(() => this.tableUpdated.set(false)),
      )
      .subscribe();
  }

  private focusNextTableButton(direction: 'up' | 'down' | 'left' | 'right' | 'home' | 'end') {
    const currentTable = this.focusedTable();
    let nextTable: Table | undefined;
    const blockPosition = currentTable?.blockPosition || 0;
    const inlinePosition = currentTable?.inlinePosition || 0;

    if (direction === 'up') {
      nextTable = this.findNextAvailableTable('blockPosition', blockPosition - 1);
    }

    if (direction === 'down') {
      nextTable = this.findNextAvailableTable('blockPosition', blockPosition + 1);
    }

    if (direction === 'left') {
      nextTable = this.findNextAvailableTable('inlinePosition', inlinePosition - 1);
    }

    if (direction === 'right') {
      nextTable = this.findNextAvailableTable('inlinePosition', inlinePosition + 1);
    }
    if (direction === 'home') {
      nextTable = this.findNextAvailableTable('inlinePosition', this.minInlinePosition());
    }
    if (direction === 'end') {
      nextTable = this.findNextAvailableTable('inlinePosition', this.maxInlinePosition());
    }
    if (!nextTable) return;
    this.focusTableNumber(nextTable);
  }

  private focusTableNumber(table: Table) {
    const tableButton = this.tableButtons()?.find(
      (btn) => btn.nativeElement.getAttribute('data-tn') === table?.number.toString(),
    );
    tableButton?.nativeElement.focus();
    this.focusedTable.set(table);
  }

  private findNextAvailableTable(findCriteria: 'blockPosition' | 'inlinePosition', value: number) {
    const notUsedCriteria = findCriteria === 'blockPosition' ? 'inlinePosition' : 'blockPosition';

    return this.tables().find(
      (table) =>
        table[findCriteria] === value &&
        table[notUsedCriteria] === this.focusedTable()?.[notUsedCriteria],
    );
  }

  protected keyboardInteraction(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.focusNextTableButton('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextTableButton('down');
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.focusNextTableButton('left');
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.focusNextTableButton('right');
        break;
      case 'Home':
        event.preventDefault();
        this.focusNextTableButton('home');
        break;
      case 'End':
        event.preventDefault();
        this.focusNextTableButton('end');
        break;
    }
  }

  protected isTableDisabled(table: Table): boolean {
    return table.status !== TableStatus.NEEDS_CLEANING;
  }

  protected isTableFocusable(table: Table): boolean {
    if (!this.focusedTable()) return table.number === this.tables()[0].number;
    return table.number === this.focusedTable()?.number;
  }

  private getTables() {
    this.httpHandlerService
      .getRequest<Table[]>(UrlProvider.getAvailableTables, {
        date: new Date().toLocaleString(),
      })
      .subscribe((tables) => {
        this.tables.set(tables);
      });
  }
}
