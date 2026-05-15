import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableComponent } from './table.component';
import { Table, TableStatus } from '../../interfaces/table.interface';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let debugElement: DebugElement;

  const mockTables: Table[] = [
    {
      number: 1,
      capacity: 2,
      inlinePosition: 1,
      blockPosition: 1,
      availableHours: ['12:00', '13:00', '14:00'],
      status: TableStatus.FREE,
    },
    {
      number: 2,
      capacity: 4,
      inlinePosition: 2,
      blockPosition: 1,
      availableHours: ['12:00', '13:00'],
      status: TableStatus.OCCUPIED,
    },
    {
      number: 3,
      capacity: 6,
      inlinePosition: 3,
      blockPosition: 1,
      availableHours: ['12:00', '14:00', '15:00'],
      status: TableStatus.NEEDS_CLEANING,
    },
    {
      number: 4,
      capacity: 2,
      inlinePosition: 1,
      blockPosition: 2,
      availableHours: ['13:00', '14:00'],
      status: TableStatus.BLOCKED,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.componentRef.setInput('tables', mockTables);
    fixture.componentRef.setInput('guests', 2);
    fixture.componentRef.setInput('selectedHour', '12:00');

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with required inputs', () => {
      expect(component.tables()).toEqual(mockTables);
      expect(component.guests()).toBe(2);
      expect(component.selectedHour()).toBe('12:00');
    });

    it('should initialize currentSelectedTable as null', () => {
      expect(component.currentSelectedTable()).toBeNull();
    });
  });

  describe('Computed Properties - Position Ranges', () => {
    it('should calculate minInlinePosition correctly', () => {
      expect(component['minInlinePosition']()).toBe(1);
    });

    it('should calculate maxInlinePosition correctly', () => {
      expect(component['maxInlinePosition']()).toBe(3);
    });

    it('should calculate minBlockPosition correctly', () => {
      expect(component['minBlockPosition']()).toBe(1);
    });

    it('should calculate maxBlockPosition correctly', () => {
      expect(component['maxBlockPosition']()).toBe(2);
    });

    it('should handle empty tables array for minInlinePosition', () => {
      fixture.componentRef.setInput('tables', []);
      fixture.detectChanges();
      expect(component['minInlinePosition']()).toBe(1);
    });

    it('should handle empty tables array for maxInlinePosition', () => {
      fixture.componentRef.setInput('tables', []);
      fixture.detectChanges();
      expect(component['maxInlinePosition']()).toBe(1);
    });
  });

  describe('Computed Properties - Track Counts', () => {
    it('should calculate inlineTrackCount correctly', () => {
      expect(component['inlineTrackCount']()).toBe(3);
    });

    it('should calculate blockTrackCount correctly', () => {
      expect(component['blockTrackCount']()).toBe(2);
    });

    it('should update track counts when tables change', () => {
      const newTables: Table[] = [
        {
          number: 1,
          capacity: 2,
          inlinePosition: 5,
          blockPosition: 5,
          availableHours: ['12:00'],
          status: TableStatus.FREE,
        },
      ];
      fixture.componentRef.setInput('tables', newTables);
      fixture.detectChanges();
      expect(component['inlineTrackCount']()).toBe(1);
      expect(component['blockTrackCount']()).toBe(1);
    });
  });

  describe('Grid Position Calculations', () => {
    it('should calculate correct inline track for table', () => {
      const table = mockTables[0];
      const track = component['getInlineTrack'](table);
      expect(track).toBe(1);
    });

    it('should calculate correct block track for table', () => {
      const table = mockTables[0];
      const track = component['getBlockTrack'](table);
      expect(track).toBe(1);
    });

    it('should calculate correct positions for all tables', () => {
      expect(component['getInlineTrack'](mockTables[0])).toBe(1);
      expect(component['getInlineTrack'](mockTables[1])).toBe(2);
      expect(component['getInlineTrack'](mockTables[2])).toBe(3);
      expect(component['getInlineTrack'](mockTables[3])).toBe(1);
    });
  });

  describe('Table Availability', () => {
    it('should mark table as available when capacity and hour match', () => {
      const isAvailable = component['isTableAvailable'](mockTables[0]);
      expect(isAvailable).toBe(true);
    });

    it('should mark table as unavailable when capacity is insufficient', () => {
      fixture.componentRef.setInput('guests', 4);
      fixture.detectChanges();
      const isAvailable = component['isTableAvailable'](mockTables[0]);
      expect(isAvailable).toBe(false);
    });

    it('should mark table as unavailable when hour is not in availableHours', () => {
      fixture.componentRef.setInput('selectedHour', '15:00');
      fixture.detectChanges();
      const isAvailable = component['isTableAvailable'](mockTables[0]);
      expect(isAvailable).toBe(false);
    });

    it('should mark table as unavailable when both capacity and hour dont match', () => {
      fixture.componentRef.setInput('guests', 8);
      fixture.componentRef.setInput('selectedHour', '16:00');
      fixture.detectChanges();
      const isAvailable = component['isTableAvailable'](mockTables[0]);
      expect(isAvailable).toBe(false);
    });

    it('should update availability when guests input changes', () => {
      expect(component['isTableAvailable'](mockTables[0])).toBe(true);
      fixture.componentRef.setInput('guests', 3);
      fixture.detectChanges();
      expect(component['isTableAvailable'](mockTables[0])).toBe(false);
    });

    it('should update availability when selectedHour input changes', () => {
      expect(component['isTableAvailable'](mockTables[3])).toBe(false);
      fixture.componentRef.setInput('selectedHour', '13:00');
      fixture.detectChanges();
      expect(component['isTableAvailable'](mockTables[3])).toBe(true);
    });
  });

  describe('Table Selection', () => {
    it('should emit correct table number when clicked', () => {
      let emittedValue: number | undefined;
      component.selectedTable.subscribe((tableNumber: number) => {
        emittedValue = tableNumber;
      });

      component['onTableClick'](mockTables[0]);
      expect(emittedValue).toBe(1);
    });

    it('should set currentSelectedTable when clicked', () => {
      component['onTableClick'](mockTables[0]);
      expect(component.currentSelectedTable()).toEqual(mockTables[0]);
    });

    it('should emit different table numbers for different tables', () => {
      const emittedValues: number[] = [];

      component.selectedTable.subscribe((tableNumber: number) => {
        emittedValues.push(tableNumber);
      });

      component['onTableClick'](mockTables[0]);
      component['onTableClick'](mockTables[1]);

      expect(emittedValues).toEqual([1, 2]);
    });

    it('should be able to select and deselect a table', () => {
      const emittedValues: number[] = [];

      component.selectedTable.subscribe((tableNumber: number) => {
        emittedValues.push(tableNumber);
      });

      component['onTableClick'](mockTables[0]);
      component.currentSelectedTable.set(null);
      component.selectedTable.emit(0);

      expect(emittedValues).toEqual([1, 0]);
    });
  });

  describe('ngOnChanges Lifecycle', () => {
    it('should clear selection when selected table becomes unavailable due to capacity', () => {
      component['onTableClick'](mockTables[0]);
      expect(component.currentSelectedTable()).toBeTruthy();

      fixture.componentRef.setInput('guests', 4);
      component.ngOnChanges();

      expect(component.currentSelectedTable()).toBeNull();
    });

    it('should emit 0 when clearing selection due to capacity change', () => {
      const emittedValues: number[] = [];
      component.selectedTable.subscribe((tableNumber: number) => {
        emittedValues.push(tableNumber);
      });

      component['onTableClick'](mockTables[0]);
      fixture.componentRef.setInput('guests', 4);
      component.ngOnChanges();

      expect(emittedValues[emittedValues.length - 1]).toBe(0);
    });

    it('should clear selection when selected table becomes unavailable due to hour change', () => {
      component['onTableClick'](mockTables[0]);
      expect(component.currentSelectedTable()).toBeTruthy();

      fixture.componentRef.setInput('selectedHour', '16:00');
      component.ngOnChanges();

      expect(component.currentSelectedTable()).toBeNull();
    });

    it('should keep selection if table remains available', () => {
      component['onTableClick'](mockTables[2]);
      const selectedTableBefore = component.currentSelectedTable();

      fixture.componentRef.setInput('selectedHour', '14:00');
      component.ngOnChanges();

      expect(component.currentSelectedTable()).toEqual(selectedTableBefore);
    });

    it('should handle null currentSelectedTable gracefully', () => {
      component.currentSelectedTable.set(null);
      expect(() => {
        component.ngOnChanges();
      }).not.toThrow();
    });
  });

  describe('Template Rendering', () => {
    it('should render table buttons for each table', () => {
      const buttons = debugElement.queryAll(By.css('button.table'));
      expect(buttons.length).toBe(mockTables.length);
    });

    it('should set disabled attribute on unavailable tables', () => {
      fixture.componentRef.setInput('selectedHour', '15:00');
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button.table'));
      const unavailableButtons = buttons.filter((btn) => btn.nativeElement.disabled);
      expect(unavailableButtons.length).toBeGreaterThan(0);
    });

    it('should have correct aria-selected attribute for selected table', () => {
      component['onTableClick'](mockTables[0]);
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button.table'));
      expect(buttons[0].nativeElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should emit selectedTable output when table button is clicked', () => {
      let emittedValue: number | undefined;
      component.selectedTable.subscribe((tableNumber: number) => {
        emittedValue = tableNumber;
      });

      const tableButtons = debugElement.queryAll(By.css('button.table'));
      tableButtons[0].nativeElement.click();

      expect(emittedValue).toBe(1);
    });

    it('should display correct grid column and row for each table', () => {
      const buttons = debugElement.queryAll(By.css('button.table'));

      buttons.forEach((button, index) => {
        const gridColumn = button.nativeElement.style.gridColumn;
        const gridRow = button.nativeElement.style.gridRow;

        const expectedColumn = component['getInlineTrack'](mockTables[index]);
        const expectedRow = component['getBlockTrack'](mockTables[index]);

        expect(Number(gridColumn)).toBe(expectedColumn);
        expect(Number(gridRow)).toBe(expectedRow);
      });
    });

    it('should display overlay when no hour is selected', () => {
      fixture.componentRef.setInput('selectedHour', '');
      fixture.detectChanges();

      const overlay = debugElement.query(By.css('.overlay'));
      expect(overlay).toBeTruthy();
    });

    it('should not display overlay when hour is selected', () => {
      fixture.componentRef.setInput('selectedHour', '12:00');
      fixture.detectChanges();

      const overlay = debugElement.query(By.css('.overlay'));
      expect(overlay).toBeFalsy();
    });

    it('should render legend items', () => {
      const legendItems = debugElement.queryAll(By.css('.legend-item'));
      expect(legendItems.length).toBe(3);
    });

    it('should have proper aria-label for table buttons', () => {
      const buttons = debugElement.queryAll(By.css('button.table'));
      expect(buttons[0].nativeElement.getAttribute('aria-label')).toContain('Mesa 1');
      expect(buttons[0].nativeElement.getAttribute('aria-label')).toContain('capacidad');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tables array', () => {
      fixture.componentRef.setInput('tables', []);
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button.table'));
      expect(buttons.length).toBe(0);
    });

    it('should handle single table', () => {
      fixture.componentRef.setInput('tables', [mockTables[0]]);
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button.table'));
      expect(buttons.length).toBe(1);
    });

    it('should handle zero guests', () => {
      fixture.componentRef.setInput('guests', 0);
      fixture.detectChanges();

      expect(component['isTableAvailable'](mockTables[0])).toBe(true);
    });

    it('should handle large number of guests', () => {
      fixture.componentRef.setInput('guests', 1000);
      fixture.detectChanges();

      mockTables.forEach((table) => {
        expect(component['isTableAvailable'](table)).toBe(false);
      });
    });

    it('should handle empty availableHours array', () => {
      const tableWithNoHours: Table = {
        ...mockTables[0],
        availableHours: [],
      };

      const isAvailable = component['isTableAvailable'](tableWithNoHours);
      expect(isAvailable).toBe(false);
    });

    it('should handle rapid selection changes', () => {
      component['onTableClick'](mockTables[0]);
      expect(component.currentSelectedTable()?.number).toBe(1);

      component['onTableClick'](mockTables[1]);
      expect(component.currentSelectedTable()?.number).toBe(2);

      component['onTableClick'](mockTables[2]);
      expect(component.currentSelectedTable()?.number).toBe(3);
    });
  });

  describe('Icons and Resources', () => {
    it('should have faToilet icon defined', () => {
      expect(component['faToilet']).toBeDefined();
    });

    it('should have faKitchen icon defined', () => {
      expect(component['faKitchen']).toBeDefined();
    });

    it('should have faUser icon defined', () => {
      expect(component['faUser']).toBeDefined();
    });
  });
});
