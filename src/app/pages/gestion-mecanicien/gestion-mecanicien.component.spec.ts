import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMecanicienComponent } from './gestion-mecanicien.component';

describe('GestionMecanicienComponent', () => {
  let component: GestionMecanicienComponent;
  let fixture: ComponentFixture<GestionMecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMecanicienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionMecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
