import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAdmin } from './business-admin';

describe('BusinessAdmin', () => {
  let component: BusinessAdmin;
  let fixture: ComponentFixture<BusinessAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and have initial data', () => {
    expect(component).toBeTruthy();
    expect(component.businessName).toBe('Mi Negocio de Ejemplo');
    expect(component.products.length).toBeGreaterThan(0);
    expect(component.tags.length).toBeGreaterThan(0);
  });
});
