import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReparationComponent } from './detail-reparation.component';

describe('DetailReparationComponent', () => {
  let component: DetailReparationComponent;
  let fixture: ComponentFixture<DetailReparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReparationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailReparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
