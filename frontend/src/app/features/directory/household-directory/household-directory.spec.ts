import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDirectory } from './household-directory';

describe('HouseholdDirectory', () => {
  let component: HouseholdDirectory;
  let fixture: ComponentFixture<HouseholdDirectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdDirectory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDirectory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
