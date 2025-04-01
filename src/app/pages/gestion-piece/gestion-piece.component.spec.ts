import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPieceComponent } from './gestion-piece.component';

describe('GestionPieceComponent', () => {
  let component: GestionPieceComponent;
  let fixture: ComponentFixture<GestionPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
