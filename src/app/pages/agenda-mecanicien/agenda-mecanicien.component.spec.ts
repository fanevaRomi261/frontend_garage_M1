import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMecanicienComponent } from './agenda-mecanicien.component';

describe('AgendaMecanicienComponent', () => {
  let component: AgendaMecanicienComponent;
  let fixture: ComponentFixture<AgendaMecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaMecanicienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaMecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
