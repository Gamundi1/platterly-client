import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnChanges,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKitchenSet, faRestroom, faUser } from '@fortawesome/free-solid-svg-icons';
import { Table } from '../../interfaces/table.interface';

@Component({
  selector: 'booking-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FaIconComponent],
  host: {
    '(keydown)': 'keyboardInteraction($event)',
  },
})
export class TableComponent {
  public tables = input.required<Table[]>();
  public guests = input.required<number>();
  public selectedHour = input.required<string>();
  public selectedTable = output<number>();

  currentSelectedTable = signal<Table | null>(null);
  focusedTable = signal<Table | null>(null);

  protected faToilet = faRestroom;
  protected faKitchen = faKitchenSet;
  protected faUser = faUser;

  constructor() {
    effect(() => {
      this.verifyCurrentTableAvailability(this.selectedHour(), this.tables());
    });
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

  protected isTableAvailable(table: Table): boolean {
    return table.capacity >= this.guests() && table.availableHours.includes(this.selectedHour());
  }

  protected onTableClick(table: Table): void {
    this.focusedTable.set(table);
    this.currentSelectedTable.set(table);
    this.selectedTable.emit(table.number);
  }

  private focusNextTableButton(direction: 'up' | 'down' | 'left' | 'right') {
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

  private verifyCurrentTableAvailability(selectedHour: string, tables: Table[]) {
    if (!this.currentSelectedTable()) return;
    const newTable = tables.find((table) => table.number === this.currentSelectedTable()!.number);

    if (!newTable || !this.isTableAvailable(newTable) || !selectedHour) {
      this.currentSelectedTable.set(null);
      this.selectedTable.emit(0);
      return;
    }

    this.currentSelectedTable.set(newTable);
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
    }
  }
}
