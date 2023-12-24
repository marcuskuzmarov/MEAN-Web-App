import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccUseComponent } from './acc-use.component';

describe('AccUseComponent', () => {
  let component: AccUseComponent;
  let fixture: ComponentFixture<AccUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccUseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
