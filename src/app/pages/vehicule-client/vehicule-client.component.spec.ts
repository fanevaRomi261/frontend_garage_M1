import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeClientComponent } from './vehicule-client.component';

describe('VehiculeClientComponent', () => {
  let component: VehiculeClientComponent;
  let fixture: ComponentFixture<VehiculeClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiculeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
