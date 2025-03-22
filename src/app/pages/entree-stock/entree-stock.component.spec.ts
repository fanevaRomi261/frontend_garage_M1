import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreeStockComponent } from './entree-stock.component';

describe('EntreeStockComponent', () => {
  let component: EntreeStockComponent;
  let fixture: ComponentFixture<EntreeStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntreeStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntreeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
