import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueReparationClientComponent } from './historique-reparation-client.component';

describe('HistoriqueReparationClientComponent', () => {
  let component: HistoriqueReparationClientComponent;
  let fixture: ComponentFixture<HistoriqueReparationClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueReparationClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueReparationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
